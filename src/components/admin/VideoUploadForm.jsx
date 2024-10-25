import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideos } from '../../contexts/VideoContext';
import { toast } from 'react-toastify';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { FaPlus } from 'react-icons/fa';

const VideoUploadForm = () => {
  const navigate = useNavigate();
  const { addVideo } = useVideos();
  const [loading, setLoading] = useState(false);

  const defaultCategories = [
    { id: 1, name: 'Nature' },
    { id: 2, name: 'Urban' },
    { id: 3, name: 'Technology' },
    { id: 4, name: 'Lifestyle' },
    { id: 5, name: 'Business' }
  ];

  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    previewUrl: '',
    downloadUrl: '',
    duration: '',
    quality: '1080p'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVideoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateUrls = async () => {
    const previewValid = await validateVideoUrl(videoData.previewUrl);
    const downloadValid = await validateVideoUrl(videoData.downloadUrl);

    if (!previewValid) {
      throw new Error('Invalid preview video URL');
    }
    if (!downloadValid) {
      throw new Error('Invalid download video URL');
    }
  };

  const validateVideoUrl = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok && response.headers.get('content-type')?.startsWith('video/');
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      if (!videoData.title.trim()) {
        throw new Error('Title is required');
      }

      if (!videoData.category) {
        throw new Error('Category is required');
      }

      await validateUrls();

      const formattedVideo = {
        ...videoData,
        tags: videoData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        createdAt: new Date().toISOString()
      };

      await addVideo(formattedVideo);
      toast.success('Video added successfully');
      navigate('/admin/videos');
    } catch (error) {
      toast.error(error.message || 'Failed to add video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">Add New Video</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="title"
            label="Title"
            name="title"
            value={videoData.title}
            onChange={handleInputChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              name="category"
              value={videoData.category}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
              required
            >
              <option value="">Select Category</option>
              {defaultCategories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          id="description"
          label="Description"
          name="description"
          value={videoData.description}
          onChange={handleInputChange}
          textarea
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="previewUrl"
            label="Preview Video URL"
            name="previewUrl"
            value={videoData.previewUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/preview.mp4"
            required
          />

          <Input
            id="downloadUrl"
            label="Download Video URL"
            name="downloadUrl"
            value={videoData.downloadUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/download.mp4"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="duration"
            label="Duration (e.g., 2:30)"
            name="duration"
            value={videoData.duration}
            onChange={handleInputChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video Quality
            </label>
            <select
              name="quality"
              value={videoData.quality}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
              required
            >
              <option value="1080p">1080p</option>
              <option value="2k">2K</option>
              <option value="4k">4K</option>
            </select>
          </div>
        </div>

        <Input
          id="tags"
          label="Tags (comma-separated)"
          name="tags"
          value={videoData.tags}
          onChange={handleInputChange}
          placeholder="nature, sunset, 4k"
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            <FaPlus className="mr-2" />
            {loading ? 'Adding Video...' : 'Add Video'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default VideoUploadForm;