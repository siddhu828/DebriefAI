const Audio = require("../models/audio");

const saveAudioURL = async (req, res) => {
  const { url } = req.body;
  const userId = req.user?.id || req.userId;

  if (!url || !userId) {
    return res.status(400).json({ message: "Missing URL or User ID" });
  }

  try {
    const audio = new Audio({ url, user: userId });
    await audio.save();
    res.status(201).json({ message: "Audio URL saved", audio });
  } catch (err) {
    console.error("Error saving audio:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserAudios = async (req, res) => {
  const userId = req.user?.id || req.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID missing" });
  }

  try {
    const audios = await Audio.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ audios });
  } catch (err) {
    console.error("Error fetching user audios:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports={saveAudioURL, getUserAudios};