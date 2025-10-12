const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, safeName);
  },
});

function fileFilter(req, file, cb) {
  if (file.mimetype && file.mimetype.startsWith("video/")) cb(null, true);
  else cb(new Error("Only video files allowed"), false);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 },
});

router.post("/", upload.single("video"), (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, message: "No file uploaded" });
  res.json({
    ok: true,
    message: "Upload successful",
    file: {
      filename: req.file.filename,
      path: req.file.path,
    },
  });
});

module.exports = router;
