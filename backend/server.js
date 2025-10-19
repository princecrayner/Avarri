// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// ---------------------------
// Basic setup
// ---------------------------
const app = express();
const PORT = process.env.PORT || 5000;

// Fix for ES modules (so we can use __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// ---------------------------
// MongoDB Connection
// ---------------------------
mongoose
  .connect("mongodb+srv://princecrayner_db_user:JUNIOR80@cluster0.toxhpdn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------------------------
// Define Mongoose schema
// ---------------------------
const videoSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
});

const Video = mongoose.model("Video", videoSchema);

// ---------------------------
// File upload setup (multer)
// ---------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g. 1729342.mp4
  },
});

const upload = multer({ storage });

// Make uploads folder public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------------------
// Routes
// ---------------------------

// Upload a new video
app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const video = new Video({
      title: req.body.title || "Untitled Video",
      videoUrl: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
    });

    await video.save();
    res.json({ success: true, video });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

// Get all videos
app.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find().sort({ _id: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch videos" });
  }
});

// Increment view count
app.post("/videos/:id/view", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.views += 1;
    await video.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Error updating views" });
  }
});

// Increment like count
app.post("/videos/:id/like", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.likes += 1;
    await video.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Error updating likes" });
  }
});

// ---------------------------
// Start the server
// ---------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
