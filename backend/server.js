require('dotenv').config(); // Load environment variables first

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// ensure upload folders exist
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const THUMB_DIR = path.join(__dirname, 'thumbnails');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
if (!fs.existsSync(THUMB_DIR)) fs.mkdirSync(THUMB_DIR);

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/videos', require('./routes/videos'));

// simple health check
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Avarri Backend</h1><p>Your API is running!</p>');
});
const PORT = process.env.PORT || 5000;
app.use("/api/upload", require("./routes/upload"));

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Avarri backend is running successfully!");
});

