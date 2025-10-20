// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ---------------------------
// Basic setup
// ---------------------------
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ---------------------------
// MongoDB Connection
// ---------------------------
mongoose
  .connect("mongodb+srv://princecrayner_db_user:JUNIOR80@cluster0.toxhpdn.mongodb.net/avarri?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ---------------------------
// Multer Setup for Video Uploads
// ---------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /mp4|mov|avi|mkv|webm/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Unsupported file type"));
  },
});

// ---------------------------
// Video Schema and Model
// ---------------------------
const videoSchema = new mongoose.Schema({
  title: String,
  filePath: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
});

const Video = mongoose.model("Video", videoSchema);

// ---------------------------
// API Routes
// ---------------------------

// Upload a video
app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newVideo = new Video({
      title,
      filePath: req.file.filename,
    });

    await newVideo.save();
    res.json({ message: "Upload successful", video: newVideo });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// Fetch all videos
app.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find().sort({ _id: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching videos" });
  }
});

// Serve uploaded videos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------------------
// Serve React Frontend (✅ fixed path for Render)
// ---------------------------
const frontendPath = path.join(__dirname, "frontend", "build");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ---------------------------
// Start Server
// ---------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
