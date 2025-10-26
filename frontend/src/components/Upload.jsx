import React, { useState } from "react";
import API from "../api";

export default function Upload({ onUploaded }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a video");

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);

    try {
      setUploading(true);
      setProgress(0);

      const res = await API.post("/videos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        },
      });

      setUploading(false);
      setProgress(100);
      onUploaded(res.data.video);
      setFile(null);
      setTitle("");
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  return (
    <div className="upload-box">
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          required
        />
        <button type="submit" disabled={uploading}>
          {uploading ? `Uploading ${progress}%` : "Upload"}
        </button>
      </form>
      {uploading && <div className="progress">Progress: {progress}%</div>}
    </div>
  );
}
