import React, { useState, useEffect } from "react";
import Upload from "./components/Upload";
import VideoCard from "./components/VideoCard";

function App() {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/videos")
      .then((res) => res.json())
      .then(setVideos)
      .catch(console.error);
  }, []);

  const handleUploaded = (video) => {
    setVideos((prev) => [video, ...prev]);
  };

  return (
    <div className="container">
      <div className="top-bar">
        <h1 className="logo">Avarri</h1>

        <input
          type="text"
          className="search-bar"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          className="upload-btn"
          onClick={() => document.getElementById("fileInput").click()}
        >
          Upload
        </button>

        <input
          id="fileInput"
          type="file"
          accept="video/*"
          style={{ display: "none" }}
          onChange={(e) => alert(`Selected: ${e.target.files[0]?.name}`)}
        />
      </div>

      <div className="video-grid">
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
