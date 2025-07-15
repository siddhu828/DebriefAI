const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  media: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "mediaType",
    required: true,
  },
  mediaType: {
    type: String,
    enum: ["Media", "Audio"], // depends on which model you're linking to
    required: true,
  },
  transcript: {
    type: String,
    required: true,
  },
  summary: [String],
  actionItems: [String],
  keyDecisions: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transcript", transcriptSchema);