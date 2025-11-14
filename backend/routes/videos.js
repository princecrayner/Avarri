const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');
const Video = require('../models/Video');

// multer memory storage (we stream from memory directly to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 512 } // 512MB limit in server (adjust as needed)
});

// POST /api/videos/upload
router.post('/upload', upload.single('video'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    // stream buffer to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'video', folder: 'avarri_videos' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Upload failed', details: error });
        }

        // Save metadata to MongoDB
        const videoDoc = new Video({
          title: req.body.title || 'Untitled',
          description: req.body.description || '',
          cloudinaryPublicId: result.public_id,
          cloudinaryUrl: result.secure_url,
          duration: result.duration || null,
          size: req.file.size,
          uploader: req.body.uploader || 'anonymous'
        });

        await videoDoc.save();

        return res.json({ success: true, video: videoDoc });
      }
    );

    // Convert buffer to stream and pipe into cloudinary upload_stream
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all videos
router.get('/', async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 }).limit(100);
  res.json(videos);
});

// GET single video metadata
router.get('/:id', async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ error: 'Not found' });
  res.json(video);
});

module.exports = router;
