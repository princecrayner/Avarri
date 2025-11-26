import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import videoRoutes from "./routes/videoRoutes.js";

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: "https://avarri.onrender.com", // frontend domain
  methods: ["GET", "POST"],
}));

mongoose.connect(process.env.MONGO_URL)

.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api", videoRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Avarri backend is running.");
});

// Render chooses its own port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
