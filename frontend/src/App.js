import React, { useState, useEffect } from "react";

function App() {
  const [videos, setVideos] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetch("https://avarri-1.onrender.com/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://avarri-1.onrender.com/upload", true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = function () {
        if (xhr.status === 200) {
          alert("Video uploaded successfully!");
          setUploadProgress(0);
          fetch("https://avarri-1.onrender.com/videos")
            .then((res) => res.json())
            .then((data) => setVideos(data));
        } else {
          alert("Upload failed.");
        }
      };

      xhr.send(formData);
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("An error occurred during upload.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-red-600">Avarri</h1>

        <input
          type="text"
          placeholder="Search..."
          className="w-1/2 px-4 py-2 border rounded-full"
        />

        <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
          Upload
          <input
            type="file"
            accept="video/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </header>

      {/* Upload progress bar */}
      {uploadProgress > 0 && (
        <div className="w-1/2 mx-auto mt-4 bg-gray-300 rounded-full h-4 overflow-hidden">
          <div
            className="bg-green-500 h-4 transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {/* Video grid */}
      <main className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div
            key={video._id}
            className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg"
          >
           <video
  src={`https://avarri-1.onrender.com/uploads/${video.filename}`}
  controls
  className="rounded-xl w-full"
></video>
 <div className="p-4">
              <h2 className="text-lg font-semibold">{video.title}</h2>
              <p className="text-sm text-gray-500">
                Views: {video.views} • Likes: {video.likes}
              </p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
