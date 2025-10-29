import React, { useEffect, useState } from 'react'
import Upload from './components/Upload'
import VideoCard from './components/VideoCard'
import API from './api'

export default function App() {
  const [videos, setVideos] = useState([])
const [searchTerm, setSearchTerm] = useState("");

  const fetchVideos = async () => {
    try {
      const res = await API.get('/videos')
      setVideos(res.data.videos)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { fetchVideos() }, [])

  const handleUploaded = (video) => {
    setVideos(prev => [video, ...prev])
  }

  const handleLikeUpdate = (updated) => {
    setVideos(prev => prev.map(v => v._id === updated._id ? updated : v))
  }

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
    onClick={() =>
      document.getElementById("upload-section").scrollIntoView({ behavior: "smooth" })
    }
  >
    Upload
  </button>
</div>

      <Upload onUploaded={handleUploaded} />

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
  )
}
