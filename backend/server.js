// server.js
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Backend public URL (set on Render or locally as env). Fallback to localhost.
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

// -- MongoDB connection (set MONGO_URI in .env or Render env)
const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) console.warn("Warning: MONGO_URI not set. Connect to MongoDB for persistence.");

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// -- Video model
const videoSchema = new mongoose.Schema({
  title: String,
  filename: String,
  videoUrl: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
const Video = mongoose.model("Video", videoSchema);

// -- Ensure uploads folder exists and serve it
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use("/uploads", express.static(uploadDir));

// -- Multer setup with simple MIME filter (accept video/*)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
function fileFilter(req, file, cb) {
  if (file.mimetype && file.mimetype.startsWith("video/")) cb(null, true);
  else cb(new Error("Only video files are allowed"));
}
const upload = multer({ storage, fileFilter });

// -- Upload endpoint
app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const title = req.body.title || req.file.originalname;
    const filename = req.file.filename;
    const videoUrl = `${BACKEND_URL.replace(/\/$/, "")}/uploads/${filename}`;

    const v = new Video({ title, filename, videoUrl });
    await v.save();

    // Return the saved document
    res.json(v);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

// -- Get all videos
app.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch videos" });
  }
});

// -- Increment view count (client should call this when user plays the video)
app.post("/videos/:id/view", async (req, res) => {
  try {
    const v = await Video.findById(req.params.id);
    if (!v) return res.status(404).json({ message: "Video not found" });
    v.views = (v.views || 0) + 1;
    await v.save();
    res.json({ views: v.views });
  } catch (err) {
    res.status(500).json({ message: "Failed to update view" });
  }
});

// -- Like
app.post("/videos/:id/like", async (req, res) => {
  try {
    const v = await Video.findById(req.params.id);
    if (!v) return res.status(404).json({ message: "Video not found" });
    v.likes = (v.likes || 0) + 1;
    await v.save();
    res.json({ likes: v.likes });
  } catch (err) {
    res.status(500).json({ message: "Failed to like" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
