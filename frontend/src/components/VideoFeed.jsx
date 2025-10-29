import React, { useEffect, useState } from "react";
import axios from "axios";

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/videos");
        setVideos(res.data);
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {videos.length === 0 ? (
        <p className="text-center text-gray-500">No videos uploaded yet.</p>
      ) : (
        videos.map((video, index) => (
          <div key={index} className="border rounded-lg shadow-lg overflow-hidden bg-white">
            <video
              src={`http://localhost:5000${video.url}`}
              controls
              className="w-full h-64 object-cover"
            />
            <div className="p-2 text-center text-sm font-medium">
              {video.name}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default VideoFeed;
