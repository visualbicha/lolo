import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVideos } from '../../contexts/VideoContext';
import { toast } from 'react-toastify';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const VideoEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVideoById, updateVideo, categories } = useVideos();
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
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    const video = getVideoById(id);
    if (video) {
      setVideoData({
        ...video,
        tags: video.tags.join(', ')
      });
    } else {
      toast.error('Video not found');
      navigate('/admin/videos');
    }
  }, [id, getVideoById, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVideoData(prev => ({
      ...prev,
      [name]: value
    }));
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
    
    try {
      const isPreviewValid = await validateVideoUrl(videoData.previewUrl);
      if (!isPreviewValid) {
        setPreviewError(true);
        toast.error('Invalid preview video URL');
        return;
      }

      const updatedVideo = {
        ...videoData,
        tags: videoData.tags.split(',').map(tag => tag.trim())
      };

      await updateVideo(id, updatedVideo);
      toast.success('Video updated successfully');
      navigate('/admin/videos');
    } catch (error) {
      toast.error('Failed to update video');
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-6">Edit Video</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
              id="category"
              name="category"
              value={videoData.category}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat.name}>{cat.name}</option>
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
            error={previewError ? 'Invalid video URL' : ''}
            required
          />

          <Input
            id="downloadUrl"
            label="Download Video URL"
            name="downloadUrl"
            value={videoData.downloadUrl}
            onChange={handleInputChange}
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
              Quality
            </label>
            <select
              id="quality"
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

        {videoData.previewUrl && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white mb-2">Preview</h3>
            <video
              src={videoData.previewUrl}
              controls
              className="w-full max-h-[300px] object-contain bg-gray-900"
              onError={() => setPreviewError(true)}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/videos')}
          >
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default VideoEdit;