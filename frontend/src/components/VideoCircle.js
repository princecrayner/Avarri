import React, { useState } from "react";

function VideoCircle() {
  const [open, setOpen] = useState(false);
  const [videos, setVideos] = useState([
    { id: 1, title: "First Upload", views: "1.2K", likes: "340" },
    { id: 2, title: "Second Upload", views: "3.4K", likes: "780" },
  ]);

  return (
    <div className="relative">
      {/* Circle icon */}
      <div
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer hover:bg-blue-700"
        title="View uploads"
      >
        🎥
      </div>

      {/* Dropdown when clicked */}
      {open && (
        <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg p-3 z-10">
          <h3 className="text-md font-semibold mb-2 text-gray-800">My Videos</h3>
          {videos.map((video) => (
            <div key={video.id} className="border-b py-1">
              <p className="text-sm font-medium">{video.title}</p>
              <p className="text-xs text-gray-500">
                {video.views} views • {video.likes} likes
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VideoCircle;
