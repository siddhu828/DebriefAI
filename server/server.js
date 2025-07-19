const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: [
    "https://nice-members-832678.framer.app",
    "https://debrief-ai.vercel.app",
  ],
  credentials: true
}));

app.use(express.json());
// MongoDB Connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection failed:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const uploadRoute = require("./routes/uploadRoute");
app.use("/api/upload", uploadRoute);

const audioRoutes = require('./routes/audioRoute');
app.use('/api/audio', audioRoutes);

const uploadFileRoute = require("./routes/uploadFileRoute");
app.use("/api/upload", uploadFileRoute);

const transcriptRoute = require('./routes/transcriptRoute');
app.use('/api/transcripts', transcriptRoute);


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});