const express = require("express");
const router = express.Router();
const { saveMediaURL, getUserMedia } = require("../controllers/uploadMediaController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/save-media", verifyToken, saveMediaURL);

router.get("/user-media", verifyToken, getUserMedia);

module.exports = router;