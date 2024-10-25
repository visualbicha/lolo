import React, { useState, useRef, useEffect } from 'react';
import { FaEdit, FaTrash, FaTags, FaChartBar, FaPlay, FaPause, FaExclamationTriangle } from 'react-icons/fa';
import Button from '../ui/Button';
import { useVideos } from '../../contexts/VideoContext';

const VideoPreview = ({ video, onEdit, onDelete, onSelect, isSelected }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);
  const { getVideoAnalytics } = useVideos();

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('loadeddata', () => setIsLoaded(true));
      videoElement.addEventListener('error', handleVideoError);
      return () => {
        videoElement.removeEventListener('loadeddata', () => setIsLoaded(true));
        videoElement.removeEventListener('error', handleVideoError);
      };
    }
  }, []);

  const handleVideoError = () => {
    console.error("Video error:", video.id);
    setHasError(true);
    setIsLoaded(true);
  };

  const togglePlay = () => {
    if (videoRef.current && !hasError) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
          setHasError(true);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAnalytics = () => {
    const analytics = getVideoAnalytics(video.id);
    alert(`Views: ${analytics.views}\nLikes: ${analytics.likes}\nShares: ${analytics.shares}`);
  };

  return (
    <div className={`relative rounded-lg overflow-hidden ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      {!hasError && (
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-48 object-cover"
          muted
          loop
          playsInline
        />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <p className="text-white">Loading video...</p>
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <FaExclamationTriangle className="text-yellow-500 mr-2" />
          <p className="text-white">Error loading video</p>
        </div>
      )}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        {!hasError && (
          <Button onClick={togglePlay} variant="secondary" className="rounded-full p-2">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </Button>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-between items-center bg-black bg-opacity-75">
        <div>
          <Button size="small" onClick={onEdit}><FaEdit /></Button>
          <Button size="small" variant="danger" onClick={onDelete}><FaTrash /></Button>
        </div>
        <div>
          <Button size="small" variant="secondary"><FaTags /></Button>
          <Button size="small" variant="secondary" onClick={handleAnalytics}><FaChartBar /></Button>
        </div>
      </div>
      <div className="absolute top-2 left-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
      </div>
      <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
        {video.duration}
      </div>
    </div>
  );
};

export default VideoPreview;