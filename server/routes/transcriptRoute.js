const express = require("express");
const router = express.Router();
const { getTranscriptAndSummary, getUserTranscripts } = require("../controllers/transcriptController");
const { verifyToken } = require("../middleware/authMiddleware");  

router.get("/user", verifyToken, getUserTranscripts);
router.get("/:id", verifyToken, getTranscriptAndSummary);  


module.exports = router;