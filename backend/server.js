// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ---------------------------
// Basic setup
// ---------------------------
const app = express();
const PORT = process.env.PORT || 5000;

// Fix for ES modules (__dirname and __filename)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadPath)); // 🔥 Makes uploads public

// ---------------------------
// MongoDB Connection
// ---------------------------
mongoose
  .connect("mongodb+srv://princecrayner_db_user:JUNIOR80@cluster0.toxhpdn.mongodb.net/avarri?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------------------------
// Mongoose Schema
// ---------------------------
const videoSchema = new mongoose.Schema({
  title: String,
  filename: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
});

const Video = mongoose.model("Video", videoSchema);

// ---------------------------
// Multer Setup
// ---------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ---------------------------
// Routes
// ---------------------------

// Upload video
app.post("/api/upload", upload.single("video"), async (req, res) => {
  try {
    const { title } = req.body;
    const video = new Video({ title, filename: req.file.filename });
    await video.save();
    res.json({ message: "✅ Upload successful", video });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Get all videos
app.get("/api/videos", async (req, res) => {
  const videos = await Video.find().sort({ _id: -1 });
  res.json(videos);
});

// Increment view count
app.post("/api/videos/:id/view", async (req, res) => {
  await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
  res.json({ message: "View counted" });
});

// Increment likes
app.post("/api/videos/:id/like", async (req, res) => {
  await Video.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });
  res.json({ message: "Like added" });
});

// ---------------------------
// Serve frontend (for deployment)
// ---------------------------
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"))
);

// ---------------------------
// Start Server
// ---------------------------
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
