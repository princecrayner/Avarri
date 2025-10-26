const express = require('express');
const upload = multer({ storage, limits: { fileSize: 2000 * 1024 * 1024 } }); // up to ~2GB (adjust)


// Upload video endpoint
router.post('/', upload.single('file'), async (req, res) => {
try {
const { title } = req.body;
if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
if (!title) return res.status(400).json({ error: 'Title required' });


const buffer = req.file.buffer;


// upload to cloudinary as a video using upload_stream
const uploadStream = cloudinary.uploader.upload_stream(
{ resource_type: 'video', folder: 'avarri' },
async (error, result) => {
if (error) {
console.error('Cloudinary upload error:', error);
return res.status(500).json({ error: 'Upload to Cloudinary failed' });
}


// Save metadata to MongoDB
const video = new Video({
title,
cloudinaryUrl: result.secure_url,
public_id: result.public_id,
});
await video.save();
res.json({ video });
}
);


streamifier.createReadStream(buffer).pipe(uploadStream);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
});


// Get all videos
router.get('/', async (req, res) => {
const videos = await Video.find().sort({ createdAt: -1 });
res.json({ videos });
});


// Get video by ID and increment views
router.get('/:id', async (req, res) => {
const video = await Video.findById(req.params.id);
if (!video) return res.status(404).json({ error: 'Not found' });
video.views += 1;
await video.save();
res.json({ video });
});


// Like a video
router.post('/:id/like', async (req, res) => {
const video = await Video.findById(req.params.id);
if (!video) return res.status(404).json({ error: 'Not found' });
video.likes += 1;
await video.save();
res.json({ video });
});


module.exports = router;
