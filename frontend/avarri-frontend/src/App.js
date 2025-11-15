import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css"; 

// Backend API URL
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

function App() {
  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [search, setSearch] = useState("");

  // Load videos when page loads
  useEffect(() => {
    fetchVideos();
  }, []);

  // GET videos from backend
  async function fetchVideos() {
    try {
      const response = await axios.get(`${API_BASE}/api/videos`);
      setVideos(response.data);
    } catch (error) {
      console.error("Failed to load videos:", error);
      alert("Failed to load videos. Make sure backend is running.");
    }
  }

  // Handle upload
  async function handleUpload(e) {
    e.preventDefault();

    if (!file) return alert("Please choose a video file.");

    const form = new FormData();
    form.append("video", file);
    form.append("title", title);
    form.append("description", desc);

    try {
      const uploadResponse = await axios.post(
        `${API_BASE}/api/videos/upload`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            console.log("Upload progress:", percent + "%");
          },
        }
      );

      alert("Video uploaded successfully!");

      // Reset form
      setTitle("");
      setDesc("");
      setFile(null);

      // Reload videos list
      fetchVideos();
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        "Upload failed. Check backend, Cloudinary credentials, and file size."
      );
    }
  }

  return (
    <div className="container">
      <h1>Avarri</h1>
    <div className="search-container">
  <input
    type="text"
    className="search-input"
    placeholder="Search"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>

      {/* Upload Section */}
      <section className="upload-box">
        <h2>Upload a Video</h2>
        <form onSubmit={handleUpload}>
          <input
            type="text"
            placeholder="Video Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>

          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button type="submit">Upload</button>
        </form>
      </section>

      {/* Videos List */}
      <section>
        <h2>Latest Videos</h2>

        {videos.length === 0 ? (
          <p>No videos uploaded yet.</p>
        ) : (
          videos
            .filter((v) =>
              v.title.toLowerCase().includes(search.toLowerCase()) ||
              v.description.toLowerCase().includes(search.toLowerCase())
            )
            .map((v) => (

            <div key={v._id} className="video-card">
              <h3>{v.title}</h3>

              <p>{v.description}</p>

              <video
                controls
                width="100%"
                src={v.cloudinaryUrl}
                style={{ marginTop: "10px" }}
              />

              <p style={{ marginTop: "5px" }}>
                Uploaded: {new Date(v.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default App;
