const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const allowedOrigins = [
  "https://debrief-ai.vercel.app",
  "https://debrief-ai-sids-projects-3dc1d54a.vercel.app",
  "https://debrief-chd5p9pbm-sids-projects-3dc1d54a.vercel.app", 
  "https://debrief-ai-git-main-sids-projects-3dc1d54a.vercel.app",
];
app.use(cors({
  origin: function (origin, callback){
    if(!origin || allowedOrigins.includes(origin)){
      callback(null,true);
    }else{
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

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

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection failed:', err));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});