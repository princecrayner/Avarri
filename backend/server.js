
import express from "express";
import cors from "cors";
import videosRoute from "./routes/videos.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API route
app.use("/api/videos", videosRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
