import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const backendURL = "http://localhost:5000"; // change to your Render URL later

  // Fetch videos
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const res = await axios.get(`${backendURL}/videos`);
    setVideos(res.data);
  };

  // Upload handler
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!video || !title) return alert("Please add a title and choose a video.");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", video);

    try {
      const res = await axios.post(`${backendURL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      if (res.data.success) {
        alert("Upload successful!");
        setUploadProgress(0);
        setTitle("");
        setVideo(null);
        fetchVideos();
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
      setUploadProgress(0);
    }
  };

  // Like handler
  const handleLike = async (id) => {
    await axios.post(`${backendURL}/like/${id}`);
    fetchVideos();
  };

  // View handler
  const handleView = async (id) => {
    await axios.post(`${backendURL}/view/${id}`);
    fetchVideos();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>🎬 Avarri Video Upload</h2>

      <form onSubmit={handleUpload} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
          required
        />

        <button
          type="submit"
          style={{
            display: "block",
            marginTop: "10px",
            padding: "10px",
            width: "100%",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Upload
        </button>

        {uploadProgress > 0 && (
          <div
            style={{
              marginTop: "10px",
              background: "#eee",
              borderRadius: "5px",
              height: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${uploadProgress}%`,
                height: "100%",
                background: "#007bff",
              }}
            ></div>
          </div>
        )}
      </form>

      <h3>📺 Videos</h3>

      {videos.length === 0 && <p>No videos uploaded yet.</p>}

      {videos.map((vid) => (
        <div
          key={vid._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          <h4>{vid.title}</h4>
          <video
            width="100%"
            height="auto"
            controls
            onPlay={() => handleView(vid._id)}
            src={vid.videoUrl}
          ></video>
          <div style={{ marginTop: "5px" }}>
            <button onClick={() => handleLike(vid._id)}>👍 {vid.likes}</button>
            <span style={{ marginLeft: "10px" }}>👁 {vid.views}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
