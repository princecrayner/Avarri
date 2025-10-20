// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ------------------------------------
// Ensure uploads directory exists
// ------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// ------------------------------------
// App setup
// ------------------------------------
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadPath));

// ------------------------------------
// MongoDB connection
// ------------------------------------
mongoose
  .connect(
    "mongodb+srv://princecrayner_db_user:JUNIOR80@cluster0.toxhpdn.mongodb.net/avarri?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------------------------
// Video model
// ------------------------------------
const videoSchema = new mongoose.Schema({
  title: String,
  filename: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
});
const Video = mongoose.model("Video", videoSchema);

// ------------------------------------
// Multer setup (for uploads)
// ------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ------------------------------------
// Upload endpoint
// ------------------------------------
app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const newVideo = new Video({
      title,
      filename: req.file.filename,
    });
    await newVideo.save();
    res.json({ message: "Upload successful", video: newVideo });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ------------------------------------
// Get all videos
// ------------------------------------
app.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find().sort({ _id: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// ------------------------------------
// Increment views
// ------------------------------------
app.post("/videos/:id/view", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });
    video.views++;
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: "Failed to update views" });
  }
});

// ------------------------------------
// Start server
// ------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
