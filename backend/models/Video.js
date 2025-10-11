const mongoose = require('mongoose');
const videoSchema = new mongoose.Schema({
title: { type: String, required: true },
description: String,
filePath: { type: String, required: true },
fileName: { type: String },
mimeType: { type: String },
thumbnailPath: String,
uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
views: { type: Number, default: 0 },
likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
module.exports = mongoose.model('Video', videoSchema);
