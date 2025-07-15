const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  url: String,
  format: String,
  transcript: String,
  summary: [String],
  actionItems: [String],
  keyDecisions: [String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isSummarized: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Media", mediaSchema);