// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ==================== Setup Paths ====================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// ==================== Express App ====================
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve uploaded videos publicly
app.use("/uploads", express.static(uploadPath));

// ==================== MongoDB ====================
mongoose
  .connect("mongodb+srv://princecrayner_db_user:JUNIOR80@cluster0.toxhpdn.mongodb.net/avarri", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ==================== Mongoose Schema ====================
const videoSchema = new mongoose.Schema({
  title: String,
  filename: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Video = mongoose.model("Video", videoSchema);

// ==================== Multer Config ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// ==================== Routes ====================

// Upload video
app.post("/api/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const video = new Video({
      title: req.body.title || "Untitled",
      filename: req.file.filename,
    });
    await video.save();

    res.status(200).json({
      message: "Upload successful",
      videoUrl: `/uploads/${req.file.filename}`,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Fetch all videos
app.get("/api/videos", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// Serve frontend (React build)
const frontendPath = path.join(__dirname, "frontend", "build");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ==================== Start Server ====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
