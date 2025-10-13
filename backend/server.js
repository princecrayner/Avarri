import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config(); // allows you to use your .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Static folder for uploaded files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/upload", uploadRoutes);

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Default route
app.get("/", (req, res) => {
  res.send("Avarri backend is running 🚀");
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
