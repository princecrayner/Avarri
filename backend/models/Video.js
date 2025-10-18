import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filename: { type: String, required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Video", videoSchema);
