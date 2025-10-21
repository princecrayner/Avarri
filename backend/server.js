// server.js

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// -------------------------------------
// Setup paths
// -------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// -------------------------------------
// Basic setup
// -------------------------------------
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir));

// -------------------------------------
// MongoDB setup
// -------------------------------------
mongoose
  .connect(
    "mongodb+srv://princecrayner_db_user:JUNIOR80@cluster0.toxhpdn.mongodb.net/avarri?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// -------------------------------------
// Mongoose model
// -------------------------------------
const videoSchema = new mongoose.Schema({
  title: String,
  filename: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
});
const Video = mongoose.model("Video", videoSchema);

// -------------------------------------
// Multer (file upload)
// -------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) cb(null, true);
    else cb(new Error("Only video files allowed!"));
  },
});

// -------------------------------------
// Routes
// -------------------------------------

// Upload route
app.post("/api/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No video uploaded" });

    const { title } = req.body;
    const video = new Video({ title, filename: req.file.filename });
    await video.save();

    res.json({ message: "Upload successful", video });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// Fetch all videos
app.get("/api/videos", async (req, res) => {
  try {
    const videos = await Video.find().sort({ _id: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching videos" });
  }
});

// Increment views
app.post("/api/videos/:id/view", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.views += 1;
    await video.save();
    res.json({ views: video.views });
  } catch (err) {
    res.status(500).json({ message: "Failed to update views" });
  }
});

// -------------------------------------
// Serve frontend build
// -------------------------------------
const frontendPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  const indexFile = path.join(frontendPath, "index.html");
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    console.error("⚠️ index.html not found:", indexFile);
    res.status(404).send("Frontend build not found.");
  }
});

// -------------------------------------
// Start server
// -------------------------------------
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
