import React, { useState, useEffect } from "react";

function App() {
  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://avarri-1.onrender.com/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((err) => console.error(err));
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      alert("Please select a video and enter a title before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);

    setUploading(true);
    setProgress(0);

    try {
      const response = await fetch("https://avarri-1.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Video uploaded successfully!");
        setFile(null);
        setTitle("");
        setUploading(false);
        setProgress(100);
        const newVideo = await response.json();
        setVideos((prev) => [newVideo, ...prev]);
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during upload.");
    }
  };

  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-red-600">Avarri</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/2 px-4 py-2 border rounded-full"
        />

        {/* Upload Button */}
        <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
          Select Video
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </header>

      {/* Upload Section */}
      {file && (
        <div className="bg-white p-4 shadow-md rounded-lg m-4">
          <video
            src={URL.createObjectURL(file)}
            controls
            className="w-full h-64 rounded-md mb-3"
          ></video>
          <input
            type="text"
            placeholder="Enter video title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md mb-3"
          />
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            disabled={uploading}
          >
            {uploading ? `Uploading... ${progress}%` : "Upload Video"}
          </button>
        </div>
      )}

      {/* Video Grid */}
      <main className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredVideos.map((video) => (
          <div
            key={video._id}
            className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <video
              src={video.url}
              controls
              className="w-full h-48 object-cover"
            ></video>
            <div className="p-4">
              <h2 className="text-lg font-semibold">{video.title}</h2>
              <p className="text-sm text-gray-600">
                Views: {video.views || 0} • Likes: {video.likes || 0}
              </p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;

