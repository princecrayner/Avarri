import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import videoRoutes from "./routes/videoRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

// allow frontend origin (use your actual Render frontend URL)
app.use(cors({
  origin: "https://<your-frontend-render-hostname>.onrender.com",
  methods: ["GET","POST","OPTIONS"],
  credentials: true
}));

// Connect to MongoDB (no legacy options)
mongoose.connect(process.env.MONGO_URL)
  .then(()=> console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

app.use("/api", videoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`🚀 Server running on port ${PORT}`));
