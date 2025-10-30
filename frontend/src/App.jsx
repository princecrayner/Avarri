import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoCard from "./components/VideoCard";

function App() {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch all uploaded videos
  useEffect(() => {
    axios.get("https://your-backend-url.com/api/videos")
      .then((res) => setVideos(res.data))
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  // Handle upload file select
  const handleUploadClick = () => {
    document.getElementById("videoUploadInput").click();
  };

  // Upload video to backend
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    try {
      await axios.post("https://your-backend-url.com/api/videos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Uploaded successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ======= NAVBAR ======= */}
      <div className="flex items-center justify-between bg-white p-4 shadow-md">
        {/* Left: Logo */}
        <h1 className="text-2xl font-bold text-red-600">Avarri</h1>

        {/* Middle: Search bar */}
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 max-w-sm border rounded-full px-4 py-2 text-gray-700 focus:outline-none"
        />

        {/* Right: Upload button */}
        <button
          onClick={handleUploadClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
        >
          Upload
        </button>

        {/* Hidden file input */}
        <input
          id="videoUploadInput"
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* ======= VIDEO GRID ======= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {videos
          .filter((v) =>
            v.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
      </div>
    </div>
  );
}

export default App;
