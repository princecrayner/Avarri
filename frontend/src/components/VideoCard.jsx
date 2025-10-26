import React from "react";
import API from "../api";

export default function VideoCard({ video, onLike }) {
  const handleLike = async () => {
    try {
      const res = await API.put(`/videos/like/${video._id}`);
      onLike(res.data.video);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="video-card">
      <video src={video.url} controls width="100%" />
      <h3>{video.title}</h3>
      <p>{video.views} views</p>
      <button onClick={handleLike}>❤️ {video.likes}</button>
    </div>
  );
}
