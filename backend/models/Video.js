const mongoose = require('mongoose');


const VideoSchema = new mongoose.Schema({
title: { type: String, required: true },
cloudinaryUrl: { type: String, required: true },
public_id: { type: String, required: true },
likes: { type: Number, default: 0 },
views: { type: Number, default: 0 },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Video', VideoSchema);
