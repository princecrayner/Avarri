import React, { useState } from "react";

const UploadButton = ({ apiUrl = "https://avarri-1.onrender.com" }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a video file first.");
    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("video", file);

    try {
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${apiUrl}/api/upload`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            setMessage("✅ Upload successful");
            resolve(data);
          } else {
            let err = "Upload failed";
            try { err = JSON.parse(xhr.responseText).message || err; } catch (e) {}
            setMessage("❌ " + err);
            reject(err);
          }
        };

        xhr.onerror = () => {
          setMessage("⚠️ Network error during upload");
          reject(new Error("Network error"));
        };

        xhr.send(formData);
      });
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setUploading(false);
      setFile(null);
      setProgress(0);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md w-full max-w-lg">
      <label className="block mb-2 font-semibold">Upload video</label>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded overflow-hidden">
            <div className="h-2 bg-green-500" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
};

export default UploadButton;
