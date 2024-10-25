import React, { useState, useRef } from 'react';
import { CloudflareService } from '../services/cloudflareService';
import { useVideos } from '../contexts/VideoContext';
import { toast } from 'react-toastify';
import Button from './ui/Button';
import Input from './ui/Input';
import { FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';

const VideoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    category: '',
    tags: ''
  });
  const fileInputRef = useRef(null);
  const { addVideo } = useVideos();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVideoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      return;
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('File size must be less than 100MB');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Upload to Cloudflare Stream
      const uploadResult = await CloudflareService.uploadVideo(file, (progress) => {
        setUploadProgress(Math.round(progress * 100));
      });

      // Wait for video processing
      const videoDetails = await CloudflareService.getVideoDetails(uploadResult.uid);

      // Add video to the platform
      const newVideo = await addVideo({
        ...videoData,
        videoUrl: videoDetails.playbackUrl,
        thumbnail: videoDetails.thumbnail,
        duration: videoDetails.duration,
        cloudflareId: videoDetails.id
      });

      toast.success('Video uploaded successfully!');
      setVideoData({
        title: '',
        description: '',
        category: '',
        tags: ''
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to upload video: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">Upload Video</h2>

      <div className="mb-6">
        <Input
          label="Title"
          name="title"
          value={videoData.title}
          onChange={handleInputChange}
          disabled={uploading}
          required
        />
      </div>

      <div className="mb-6">
        <Input
          label="Description"
          name="description"
          value={videoData.description}
          onChange={handleInputChange}
          disabled={uploading}
          textarea
          required
        />
      </div>

      <div className="mb-6">
        <Input
          label="Category"
          name="category"
          value={videoData.category}
          onChange={handleInputChange}
          disabled={uploading}
          required
        />
      </div>

      <div className="mb-6">
        <Input
          label="Tags (comma-separated)"
          name="tags"
          value={videoData.tags}
          onChange={handleInputChange}
          disabled={uploading}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Video File
        </label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="video/*"
          disabled={uploading}
          className="block w-full text-sm text-gray-300
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-500 file:text-white
            hover:file:bg-blue-600
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {uploading && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Uploading...</span>
            <span className="text-sm font-medium text-gray-300">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 rounded-full h-2 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full"
      >
        {uploading ? (
          <FaSpinner className="animate-spin mr-2" />
        ) : (
          <FaCloudUploadAlt className="mr-2" />
        )}
        {uploading ? 'Uploading...' : 'Select Video'}
      </Button>
    </div>
  );
};

export default VideoUpload;