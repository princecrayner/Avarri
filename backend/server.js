// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ ensure uploads directory always exists
const uploadPath = path.join("/tmp", "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// ---------------------------
// Express setup
// ---------------------------
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ---------------------------
// MongoDB Connection
// ---------------------------
mongoose
  .connect(
    "mongodb+srv://princecrayner_db_user:JUNIOR80@cluster0.toxhpdn.mongodb.net/avarri?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------------------------
// Video Schema
// ---------------------------
const videoSchema = new mongoose.Schema({
  title: String,
  filename: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
const Video = mongoose.model("Video", videoSchema);

// ---------------------------
// Multer Upload Setup
// ---------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

// ---------------------------
// API ROUTES
// ---------------------------

// ✅ Upload video route
app.post("/api/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const video = new Video({
      title: req.body.title || "Untitled",
      filename: req.file.filename,
    });

    await video.save();
    res.json({ message: "✅ Upload successful!", video });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// ✅ Get videos
app.get("/api/videos", async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 });
  res.json(videos);
});

// ✅ Serve uploaded files (for testing locally)
app.use("/uploads", express.static(uploadPath));

// ✅ Serve React frontend build
const frontendPath = path.resolve(__dirname, "../frontend/build");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"), (err) => {
    if (err) {
      console.error("Error serving index.html:", err);
      res.status(500).send("Error loading frontend");
    }
  });
});

// ---------------------------
// Start Server
// ---------------------------
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
