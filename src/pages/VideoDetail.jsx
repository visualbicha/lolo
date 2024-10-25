import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVideos } from '../contexts/VideoContext';
import { useAuth } from '../contexts/AuthContext';
import { FaHeart, FaShare, FaDownload, FaCrown } from 'react-icons/fa';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { toast } from 'react-toastify';

const VideoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVideoById } = useVideos();
  const { isAuthenticated, hasSubscription } = useAuth();
  const [video, setVideo] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const videoData = getVideoById(id);
    if (videoData) {
      setVideo(videoData);
    } else {
      toast.error('Video not found');
      navigate('/videos');
    }
  }, [id, getVideoById, navigate]);

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/videos/${id}` } });
      return;
    }
    navigate('/subscription');
  };

  const handleDownload = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!hasSubscription) {
      navigate('/subscription');
      return;
    }
    window.location.href = video.downloadUrl;
    toast.success('Download started!');
  };

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-400">Loading...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <div className="relative pt-[56.25%]">
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full"
            controls
            playsInline
            src={video.previewUrl}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </Card>

      <Card>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{video.title}</h1>
            <p className="text-gray-400">{video.description}</p>
          </div>
          <div className="flex space-x-2">
            {isAuthenticated && hasSubscription ? (
              <Button onClick={handleDownload} variant="success">
                <FaDownload className="mr-2" />
                Download
              </Button>
            ) : (
              <Button onClick={handleSubscribe} variant="primary">
                <FaCrown className="mr-2" />
                Subscribe to Download
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {video.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-400">
          <span className="mr-4">Quality: {video.quality}</span>
          <span className="mr-4">Duration: {video.duration}</span>
          <span>Category: {video.category}</span>
        </div>
      </Card>

      {!hasSubscription && (
        <Card className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Get Unlimited Access
              </h3>
              <p className="text-gray-200">
                Subscribe now to download this video and access our entire library
              </p>
            </div>
            <Button onClick={handleSubscribe} size="large">
              View Plans
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VideoDetail;