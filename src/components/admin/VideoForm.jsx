import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useVideos } from '../../contexts/VideoContext';

const VideoForm = ({ video, onSubmit, onCancel }) => {
  const { categories } = useVideos();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tags: [],
    description: '',
  });

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title || '',
        category: video.category || '',
        tags: video.tags || [],
        description: video.description || '',
      });
    }
  }, [video]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleTagChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prevState => ({
      ...prevState,
      tags
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-white">
            {video ? 'Edit Video' : 'Add New Video'}
          </h3>
          <form onSubmit={handleSubmit} className="mt-2 text-left">
            <Input
              id="title"
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
            <Input
              id="tags"
              label="Tags (comma-separated)"
              name="tags"
              value={formData.tags.join(', ')}
              onChange={handleTagChange}
            />
            <Input
              id="description"
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              textarea
            />
            <div className="flex justify-end space-x-3">
              <Button type="button" onClick={onCancel} variant="secondary">
                <FaTimes className="mr-2" />
                Cancel
              </Button>
              <Button type="submit">
                <FaSave className="mr-2" />
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoForm;