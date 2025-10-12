import React from "react";

function App() {
  const videos = [
    {
      id: 1,
      title: "Avarri Demo Video",
      channel: "Avarri Official",
      views: "12K views",
      time: "2 hours ago",
      thumbnail: "https://picsum.photos/400/225?random=1",
    },
    {
      id: 2,
      title: "Introducing the Avarri Platform",
      channel: "TechWorld",
      views: "8.4K views",
      time: "1 day ago",
      thumbnail: "https://picsum.photos/400/225?random=2",
    },
    {
      id: 3,
      title: "How Avarri Works Behind the Scenes",
      channel: "DevTalks",
      views: "5.2K views",
      time: "3 days ago",
      thumbnail: "https://picsum.photos/400/225?random=3",
    },
  ];

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
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Upload
        </button>
      </header>

      {/* Video grid */}
      <main className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{video.title}</h2>
              <p className="text-sm text-gray-600">{video.channel}</p>
              <p className="text-sm text-gray-500">
                {video.views} • {video.time}
              </p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
