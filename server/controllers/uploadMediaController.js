const Media = require("../models/media");

const saveMediaURL = async (req, res) => {
  const { url, format } = req.body;
  const userId = req.user?.id || req.userId;

  if (!url || !userId || !format) {
    return res.status(400).json({ message: "Missing data (url/user/format)" });
  }

  try {
    const media = new Media({ url, user: userId, format });
    await media.save();
    res.status(201).json({ message: "Media URL saved", media });
  } catch (err) {
    console.error("Error saving media:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserMedia = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const media = await Media.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ media });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user media" });
  }
};

module.exports = { saveMediaURL, getUserMedia };