const express = require('express');
const router = express.Router();
const { saveAudioURL, getUserAudios } = require('../controllers/uploadAudioController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST: Save audio URL to DB
router.post('/save', verifyToken, saveAudioURL);

// 🆕 GET: Fetch all audios by this user
router.get('/user', verifyToken, getUserAudios);

module.exports = router;