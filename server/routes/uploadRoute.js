const express = require("express");
const { saveAudioURL } = require("../controllers/uploadAudioController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/save-audio", verifyToken, saveAudioURL);

module.exports = router;