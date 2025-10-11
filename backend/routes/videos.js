const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const Video = require('../models/Video');
const { protect } = require('../middleware/authMiddleware');


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Upload video route
router.post('/upload', protect, upload.single('video'), async (req, res) => {
  try {
    // Create new video document in MongoDB
    const vid = await Video.create({
      title: req.body.title,
      description: req.body.description,
      filename: req.file.filename,
      uploader: req.user._id
    });

    // Generate a thumbnail using FFmpeg
    const thumbnailPath = `thumbnails/${req.file.filename}.png`;
    ffmpeg(`uploads/${req.file.filename}`)
      .screenshots({
        count: 1,
        folder: 'thumbnails',
        filename: `${req.file.filename}.png`,
        size: '320x240'
      })
      .on('end', () => console.log('Thumbnail created'))
      .on('error', (err) => console.error('Thumbnail error:', err));

    res.json(vid);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Stream video route
router.get('/stream/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.filename);
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

// List all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().populate('uploader', 'username');
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
