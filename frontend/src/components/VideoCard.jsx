// frontend/src/components/VideoCard.jsx
import React from "react";

export default function VideoCard({ video }) {
  const src = video.videoUrl || video.url || video.filePath || video.path || video.name || "";

  return (
    <article className="video-card">
      <div className="video-frame">
        <video className="video-player" controls src={src} />
      </div>
      <div className="video-meta">
        <div className="meta-text">Views: {video.views ?? 0} • Likes: {video.likes ?? 0}</div>
      </div>
    </article>
  );
}
