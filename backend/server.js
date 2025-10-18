import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Video from "./models/Video.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect MongoDB
mongoose.connect("mongodb+srv://princecrayner:JUNIOR80@cluster.mongodb.net/avarri", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Storage config
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Upload route
app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const video = new Video({
      title: req.body.title || req.file.originalname,
      filename: req.file.filename
    });
    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all videos
app.get("/videos", async (req, res) => {
  const videos = await Video.find().sort({ uploadedAt: -1 });
  res.json(videos);
});

// Increase view count
app.post("/videos/:id/view", async (req, res) => {
  const video = await Video.findById(req.params.id);
  video.views++;
  await video.save();
  res.json({ views: video.views });
});

// Like a video
app.post("/videos/:id/like", async (req, res) => {
  const video = await Video.findById(req.params.id);
  video.likes++;
  await video.save();
  res.json({ likes: video.likes });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
