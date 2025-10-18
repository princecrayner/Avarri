// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(
  "mongodb+srv://princecrayner_db_user:JUNIOR80@cluster0.toxhpdn.mongodb.net/avarri?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Create Video Schema
const videoSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  uploadDate: { type: Date, default: Date.now },
});

const Video = mongoose.model("Video", videoSchema);

// ✅ Upload configuration
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Upload endpoint
app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const video = new Video({
      filename: req.file.filename,
      originalname: req.file.originalname,
    });
    await video.save();
    res.status(200).json({ message: "Video uploaded successfully", video });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

// ✅ Get all videos
app.get("/videos", async (req, res) => {
  const videos = await Video.find().sort({ uploadDate: -1 });
  res.json(videos);
});

// ✅ Serve video files
app.use("/uploads", express.static(uploadDir));

// ✅ Watch a video (increments views)
app.get("/video/:id", async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: "Video not found" });

  video.views += 1;
  await video.save();

  res.json(video);
});

// ✅ Like a video
app.post("/like/:id", async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: "Video not found" });

  video.likes += 1;
  await video.save();

  res.json(video);
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
