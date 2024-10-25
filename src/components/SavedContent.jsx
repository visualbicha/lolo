import React from 'react';
import { FaPlay } from 'react-icons/fa';

const SavedContent = () => {
  const savedVideos = [
    { id: 1, title: 'Beautiful Sunset', thumbnail: 'https://example.com/sunset.jpg' },
    { id: 2, title: 'City Timelapse', thumbnail: 'https://example.com/city.jpg' },
    { id: 3, title: 'Nature Documentary', thumbnail: 'https://example.com/nature.jpg' },
  ];

  return (
    <ul className="space-y-4">
      {savedVideos.map((video) => (
        <li key={video.id} className="flex items-center">
          <img src={video.thumbnail} alt={video.title} className="w-16 h-9 object-cover rounded mr-2" />
          <span className="text-gray-300">{video.title}</span>
          <button className="ml-auto text-blue-400 hover:text-blue-300 transition-colors duration-300">
            <FaPlay />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default SavedContent;