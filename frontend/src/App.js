import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [videos, setVideos] = useState([]);
  const [videoTitle, setVideoTitle] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const BACKEND = process.env.REACT_APP_API_URL || "https://avarri-1.onrender.com";

  useEffect(() => {
    fetch(`${BACKEND}/videos`)
      .then((r) => r.json())
      .then((data) => setVideos(data))
      .catch((e) => console.error("Failed to fetch videos:", e));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side check: must be video and common playable formats
    if (!file.type.startsWith("video/")) {
      alert("Please pick a video file (mp4/webm/etc).");
      return;
    }

    if (!videoTitle.trim()) {
      alert("Please enter a title before uploading.");
      return;
    }

    const form = new FormData();
    form.append("video", file);
    form.append("title", videoTitle.trim());

    try {
      const res = await axios.post(`${BACKEND}/upload`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (p) => {
          const percent = Math.round((p.loaded * 100) / p.total);
          setUploadProgress(percent);
        },
        timeout: 0,
      });

      if (res.status === 200) {
        const newVideo = res.data;
        setVideos((prev) => [newVideo, ...prev]);
        setVideoTitle("");
        setUploadProgress(0);
      } else {
        alert("Upload failed");
        setUploadProgress(0);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. See console.");
      setUploadProgress(0);
    }
  };

  const handlePlay = async (id, url) => {
    // increment views on server
    try {
      await fetch(`${BACKEND}/videos/${id}/view`, { method: "POST" });
      // update local count quickly
      setVideos((prev) =>
        prev.map((v) => (v._id === id ? { ...v, views: (v.views || 0) + 1 } : v))
      );
      // open in new tab to watch full or you can implement modal
      window.open(url, "_blank");
    } catch (e) {
      console.error("Error incrementing view", e);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-red-600">Avarri</h1>

        <input type="text" placeholder="Search..." className="w-1/2 px-4 py-2 border rounded-full" />

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Enter video title..."
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            className="px-3 py-2 border rounded-md w-64"
          />

          <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
            Upload
            <input type="file" accept="video/*" onChange={handleUpload} className="hidden" />
          </label>
        </div>
      </header>

      {uploadProgress > 0 && (
        <div className="p-4">
          <div className="w-full bg-gray-300 rounded-full h-4">
            <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${uploadProgress}%` }} />
          </div>
          <p className="text-center mt-2 font-medium text-blue-700">Uploading... {uploadProgress}%</p>
        </div>
      )}

      <main className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div key={video._id} className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg">
            <video controls className="w-full h-48 object-cover">
              <source src={video.videoUrl} type="video/mp4" />
              <source src={video.videoUrl} />
              Your browser does not support this video format.
            </video>
            <div className="p-4">
              <h2 className="text-lg font-semibold">{video.title}</h2>
              <p className="text-sm text-gray-600">Views: {video.views || 0} • Likes: {video.likes || 0}</p>
              <div className="mt-2">
                <button onClick={() => handlePlay(video._id, video.videoUrl)} className="px-3 py-1 bg-gray-100 rounded">Watch</button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
