const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  cloudinaryPublicId: { type: String, required: true },
  cloudinaryUrl: { type: String, required: true },
  duration: Number,
  size: Number,
  uploader: { type: String, default: 'anonymous' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', VideoSchema);
