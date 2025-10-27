// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const videosRouter = require("./routes/videos"); // ✅ import router correctly

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/videos", videosRouter); // ✅ middleware function

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

