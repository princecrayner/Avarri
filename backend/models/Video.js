import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: String,
    filePath: String,
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
