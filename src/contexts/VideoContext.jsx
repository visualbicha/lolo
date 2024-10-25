import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data with working video URLs
  const mockVideos = [
    {
      id: '1',
      title: 'Ocean Waves',
      description: 'Calming ocean waves on a sunny day',
      category: 'Nature',
      tags: ['nature', 'ocean', '4k'],
      previewUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      downloadUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
      duration: '0:30',
      quality: '4K',
      createdAt: new Date().toISOString(),
      likes: 45,
      downloads: 23
    },
    {
      id: '2',
      title: 'City Life',
      description: 'Urban landscapes and city vibes',
      category: 'Urban',
      tags: ['city', 'urban', 'timelapse'],
      previewUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      downloadUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
      duration: '1:45',
      quality: '1080p',
      createdAt: new Date().toISOString(),
      likes: 32,
      downloads: 15
    },
    {
      id: '3',
      title: 'Mountain Adventure',
      description: 'Epic mountain landscapes and adventures',
      category: 'Nature',
      tags: ['mountains', 'adventure', 'scenic'],
      previewUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      downloadUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
      duration: '2:15',
      quality: '4K',
      createdAt: new Date().toISOString(),
      likes: 67,
      downloads: 42
    }
  ];

  const categories = [
    {
      name: 'Nature',
      subcategories: ['Landscapes', 'Wildlife', 'Weather']
    },
    {
      name: 'Urban',
      subcategories: ['City Life', 'Architecture', 'Street Art']
    },
    {
      name: 'Technology',
      subcategories: ['AI', 'Robotics', 'Digital Art']
    }
  ];

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setVideos(mockVideos);
      } catch (err) {
        setError('Failed to load videos');
        console.error('Error loading videos:', err);
        toast.error('Error loading videos');
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  const addVideo = async (videoData) => {
    try {
      const newVideo = {
        id: Date.now().toString(),
        ...videoData,
        createdAt: new Date().toISOString(),
        likes: 0,
        downloads: 0
      };

      setVideos(prev => [...prev, newVideo]);
      toast.success('Video added successfully');
      return newVideo;
    } catch (err) {
      console.error('Error adding video:', err);
      toast.error('Failed to add video');
      throw err;
    }
  };

  const updateVideo = async (videoId, videoData) => {
    try {
      setVideos(prev => prev.map(video => 
        video.id === videoId ? { ...video, ...videoData } : video
      ));
      toast.success('Video updated successfully');
    } catch (err) {
      console.error('Error updating video:', err);
      toast.error('Failed to update video');
      throw err;
    }
  };

  const deleteVideo = async (videoId) => {
    try {
      setVideos(prev => prev.filter(video => video.id !== videoId));
      toast.success('Video deleted successfully');
    } catch (err) {
      console.error('Error deleting video:', err);
      toast.error('Failed to delete video');
      throw err;
    }
  };

  const getVideoById = (videoId) => {
    return videos.find(video => video.id === videoId);
  };

  const getCategories = () => {
    return categories;
  };

  return (
    <VideoContext.Provider value={{
      videos,
      loading,
      error,
      categories,
      addVideo,
      updateVideo,
      deleteVideo,
      getVideoById,
      getCategories
    }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideos = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideos must be used within a VideoProvider');
  }
  return context;
};