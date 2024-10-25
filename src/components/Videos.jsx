import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useVideos } from '../contexts/VideoContext';
import { FaThLarge, FaList, FaSearch, FaPlay } from 'react-icons/fa';
import SearchBar from './SearchBar';
import Pagination from './Pagination';

const Videos = () => {
  const { videos } = useVideos();
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage] = useState(12);
  const [viewMode, setViewMode] = useState('grid');
  const videoRefs = useRef({});

  useEffect(() => {
    setFilteredVideos(videos);
  }, [videos]);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = videos.filter(video => 
      video.title.toLowerCase().includes(searchTerm) ||
      video.category.toLowerCase().includes(searchTerm)
    );
    setFilteredVideos(filtered);
    setCurrentPage(1);
  };

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleMouseEnter = (id) => {
    if (videoRefs.current[id]) {
      videoRefs.current[id].play().catch(error => {
        console.error("Error playing video:", error);
      });
    }
  };

  const handleMouseLeave = (id) => {
    if (videoRefs.current[id]) {
      videoRefs.current[id].pause();
      videoRefs.current[id].currentTime = 0;
    }
  };

  const handleVideoError = (id) => {
    console.error(`Failed to load video with id: ${id}`);
    if (videoRefs.current[id]) {
      videoRefs.current[id].poster = 'https://via.placeholder.com/400x225?text=Video+Not+Available';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-white">Videos</h1>
      
      <div className="flex justify-between items-center mb-6">
        <SearchBar onSearch={handleSearch} />
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500' : 'bg-gray-700'}`}
          >
            <FaThLarge />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500' : 'bg-gray-700'}`}
          >
            <FaList />
          </button>
        </div>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'space-y-4'}>
        {currentVideos.map((video) => (
          <Link key={video.id} to={`/videos/${video.id}`} className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${viewMode === 'list' ? 'flex' : ''}`}>
            <div className={`relative ${viewMode === 'list' ? 'w-1/3' : 'w-full'}`} onMouseEnter={() => handleMouseEnter(video.id)} onMouseLeave={() => handleMouseLeave(video.id)}>
              <video
                ref={el => videoRefs.current[video.id] = el}
                src={video.videoUrl}
                poster={video.thumbnail || 'https://via.placeholder.com/400x225?text=Video+Thumbnail'}
                className="w-full h-48 object-cover"
                muted
                loop
                playsInline
                onError={() => handleVideoError(video.id)}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <FaPlay className="text-white text-4xl" />
              </div>
            </div>
            <div className={`p-4 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
              <h2 className="text-xl font-semibold mb-2 text-white">{video.title}</h2>
              <p className="text-gray-400 mb-2">{video.category}</p>
              <p className="text-gray-400">{video.duration}</p>
            </div>
          </Link>
        ))}
      </div>

      <Pagination
        itemsPerPage={videosPerPage}
        totalItems={filteredVideos.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Videos;