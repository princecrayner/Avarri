import React, { useState, useEffect } from "react";

function App() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("https://avarri-1.onrender.com/videos")
      .then(res => res.json())
      .then(setVideos)
      .catch(console.error);
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("video", file);

    const response = await fetch("https://avarri-1.onrender.com/upload", {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      alert("Uploaded!");
      const newVideo = await response.json();
      setVideos([newVideo, ...videos]);
    }
  };

  const handleView = async (id) => {
    await fetch(`https://avarri-1.onrender.com/videos/${id}/view`, { method: "POST" });
    window.open(`https://avarri-1.onrender.com/uploads/${id}`, "_blank");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-red-600">Avarri</h1>
        <input type="text" placeholder="Search..." className="w-1/2 px-4 py-2 border rounded-full" />
        <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
          Upload
          <input type="file" accept="video/*" onChange={handleUpload} className="hidden" />
        </label>
      </header>

      <main className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map(video => (
          <div key={video._id} onClick={() => handleView(video._id)} className="cursor-pointer bg-white rounded-xl overflow-hidden shadow hover:shadow-lg">
            <video src={`https://avarri-1.onrender.com/uploads/${video.filename}`} controls className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{video.title}</h2>
              <p className="text-sm text-gray-600">Views: {video.views} • Likes: {video.likes}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
