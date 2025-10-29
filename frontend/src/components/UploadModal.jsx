import React, { useState } from "react";
import axios from "axios";

const UploadModal = ({ onClose, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return alert("Please enter a title and choose a file.");

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);

    try {
      setUploading(true);
      setMessage("Uploading...");

      const res = await axios.post("http://localhost:5000/api/videos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (p) => {
          const percent = Math.round((p.loaded * 100) / p.total);
          setProgress(percent);
        },
      });

      setMessage("✅ Uploaded successfully!");
      onUploaded(); // Refresh video feed
      setFile(null);
      setTitle("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Upload to Avarri</h2>
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

          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {uploading ? `Uploading ${progress}%` : "Upload"}
          </button>
        </form>

        <p className="text-center mt-3 text-sm">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 border rounded hover:bg-gray-100"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UploadModal;
