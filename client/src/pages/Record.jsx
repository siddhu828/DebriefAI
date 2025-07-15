import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  LinearProgress,
  IconButton,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { toast } from "react-toastify";
import useTranscriptStore from "../store/useTranscriptStore";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";


function Record() {
  const auth = useAuthStore();
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [file, setLocalFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(null);
  const { setFile } = useTranscriptStore();
  const [savedId, setSavedId] = useState(null);

  const handleStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        chunksRef.current = [];

        const file = new File([blob], "recording.webm", { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setFile(file);
        setLocalFile(file);

        toast.success("Recording stopped. Preview before saving.");
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      toast("Recording started...");
    } catch (err) {
      toast.error("Mic access denied or error!");
    }
  };

  const handleStop = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleRecordAgain = () => {
    setAudioUrl(null);
    setFile(null);
    setLocalFile(null);
    setPlaying(false);
    setAudioDuration(null);
  };

  const handleSave = async () => {
    if (!file) {
      toast.error("No audio to save.");
      return;
    }

    setUploading(true);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "debrief.AI");

      const res = await fetch("https://api.cloudinary.com/v1_1/dzve0febp/auto/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!result.secure_url) {
        throw new Error("Cloudinary upload failed.");
      }

      const saveRes = await fetch("http://localhost:5050/api/upload/save-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ url: result.secure_url }),
      });

      const saveResult = await saveRes.json();

      if (saveRes.ok) {
        toast.success("Audio saved to DB!");
        const id = saveResult.media?._id;
        setSavedId(id);
      } else {
        toast.error(saveResult.message || "Failed to save to DB.");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Save failed.");
    } finally {
      setUploading(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    playing ? audioRef.current.pause() : audioRef.current.play();
    setPlaying(!playing);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onloadedmetadata = () => {
        const durationInSeconds = audioRef.current.duration;
        setAudioDuration(durationInSeconds.toFixed(1));
      };
    }
  }, [audioUrl]);

  return (
    <Box p={0}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Record Audio
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Start recording and save when ready
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="contained"
            startIcon={recording ? <StopIcon /> : <MicIcon />}
            onClick={recording ? handleStop : handleStart}
            color={recording ? "error" : "primary"}
          >
            {recording ? "Stop Recording" : "Start Recording"}
          </Button>

          {audioUrl && (
            <IconButton onClick={togglePlayback}>
              {playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
          )}
        </Stack>

        {uploading && (
          <Box mt={2}>
            <Typography variant="body2">Uploading...</Typography>
            <LinearProgress />
          </Box>
        )}

        {audioUrl && (
          <Box mt={3}>
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setPlaying(false)}
              controls
              style={{ width: "100%" }}
            />
            <Stack direction="row" spacing={2} mt={2}>
              <Button variant="outlined" color="secondary" onClick={handleRecordAgain}>
                Record Again
              </Button>
              <Button variant="contained" color="success" onClick={handleSave} disabled={uploading}>
                Save
              </Button>
              <Typography variant="body2" color="text.secondary" mt={1.5}>
                Go to dashboard after saving
              </Typography>
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default Record;