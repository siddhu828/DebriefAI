const fs = require("fs");
const axios = require("axios");
const mime = require("mime-types");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const Media = require("../models/media");
const Audio = require("../models/audio");
const Transcript = require("../models/transcript");
const downloadFileFromURL = require("../utils/downloadFromCloudinary");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function extractAudio(videoPath, outputAudioPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .audioCodec("libmp3lame")
      .save(outputAudioPath)
      .on("end", () => resolve(outputAudioPath))
      .on("error", (err) => reject(err));
  });
}
function splitTranscript(text, maxWords = 1500) {
  const words = text.split(" ");
  const chunks = [];
  for (let i = 0; i < words.length; i += maxWords) {
    chunks.push(words.slice(i, i + maxWords).join(" "));
  }
  return chunks;
}
function splitAudio(inputPath, chunkDurationSec = 600) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) return reject(err);

      const duration = metadata.format.duration;
      const chunkCount = Math.ceil(duration / chunkDurationSec);
      const outputPaths = [];

      let completed = 0;
      for (let i = 0; i < chunkCount; i++) {
        const startTime = i * chunkDurationSec;
        const outputPath = inputPath.replace(/\.mp3$/, `_part${i}.mp3`);
        outputPaths.push(outputPath);

        ffmpeg(inputPath)
          .setStartTime(startTime)
          .duration(chunkDurationSec)
          .output(outputPath)
          .on("end", () => {
            completed++;
            if (completed === chunkCount) resolve(outputPaths);
          })
          .on("error", reject)
          .run();
      }
    });
  });
}

exports.getTranscriptAndSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    let media = await Media.findById(id);
    let mediaType = "Media";

    if (!media) {
      media = await Audio.findById(id);
      if (!media) return res.status(404).json({ message: "Media not found" });
      mediaType = "Audio";
    }

    // 🟢 Check if already transcribed
    const existingTranscript = await Transcript.findOne({
      user: userId,
      media: media._id,
      mediaType,
    });

    if (existingTranscript) {
      return res.status(200).json(existingTranscript);
    }

    // 🟢 Begin transcription process
    const originalPath = await downloadFileFromURL(media.url);
    let finalAudioPath = originalPath;

    const mimeType = mime.lookup(originalPath);
    if (mimeType && mimeType.startsWith("video/")) {
      const audioOutputPath = path.resolve(__dirname, "../temp/extractedAudio.mp3");
      await extractAudio(originalPath, audioOutputPath);
      fs.unlinkSync(originalPath);
      finalAudioPath = audioOutputPath;
    }

    const audioChunks = await splitAudio(finalAudioPath, 600); // Split into 10-min chunks
let fullTranscript = "";

for (const chunkPath of audioChunks) {
  const chunkStream = fs.createReadStream(chunkPath);
  const chunkContentType = mime.lookup(chunkPath) || "audio/mp3";

  const response = await axios.post(
    "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
    chunkStream,
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": chunkContentType,
        Accept: "application/json",
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    }
  );

  fullTranscript += (response.data.text || response.data) + "\n";
  fs.unlinkSync(chunkPath); // Cleanup
}

fs.unlinkSync(finalAudioPath); // Delete main file after chunking
const transcriptText = fullTranscript;
    let summary = [], actionItems = [], keyDecisions = [];
    const transcriptChunks = splitTranscript(transcriptText);
    for (let i = 0; i < transcriptChunks.length; i++) {
      const chunk = transcriptChunks[i];
      const prompt = `Given the following transcript chunk, extract the following in JSON format:
      {
        "summary": ["..."],
        "actionItems": ["..."],
        "keyDecisions": ["..."]
      }
      Transcript Chunk (${i + 1}):
      ${chunk}`;
    
      try {
        const geminiResponse = await geminiModel.generateContent(prompt);
        const result = geminiResponse.response.text();
    
        console.log(`🧠 Gemini response for chunk ${i + 1}:\n`, result);
    
        const jsonMatch = result.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          summary.push(...(parsed.summary || []));
          actionItems.push(...(parsed.actionItems || []));
          keyDecisions.push(...(parsed.keyDecisions || []));
        } else {
          console.warn(`⚠️ No valid JSON found in chunk ${i + 1}`);
        }
      } catch (err) {
        console.error(`❌ Gemini failed on chunk ${i + 1}:`, err.message);
      }
    }

    // 🟢 Save transcript to DB
    const newTranscript = new Transcript({
      user: userId,
      media: media._id,
      mediaType,
      transcript: transcriptText,
      summary,
      actionItems,
      keyDecisions,
    });

    await newTranscript.save();
    console.log("✅ Saved transcript for media ID:", media._id);

    res.status(200).json(newTranscript);
  } catch (error) {
    console.error("Transcript fetch error:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

exports.getUserTranscripts = async (req, res) => {
  try {
    const userId = req.userId;

    const transcripts = await Transcript.find({ user: userId }).populate("media");
    res.status(200).json({ transcripts });
  } catch (err) {
    console.error("❌ Error fetching transcripts:", err.message);
    res.status(500).json({ message: "Failed to fetch transcripts" });
  }
};