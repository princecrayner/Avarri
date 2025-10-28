// frontend/src/components/Upload.jsx
import React, { useState } from "react";
import axios from "axios";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return alert("Please select a video and add a title");

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);

    try {
      setUploading(true);
      setProgress(0);
      setMessage("");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/videos/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (p) => {
            const percent = Math.round((p.loaded * 100) / p.total);
            setProgress(percent);
          },
        }
      );

      setMessage("✅ Uploaded successfully!");
      console.log("Uploaded:", res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow bg-white max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-3 text-center">Upload to Avarri</h2>
      <form onSubmit={handleUpload} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {uploading && (
          <div className="mt-2">
            <p>Uploading: {progress}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        {message && <p className="text-center mt-2">{message}</p>}
      </form>
    </div>
  );
}
