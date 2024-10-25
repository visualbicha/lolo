import React, { useState, useEffect } from 'react';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import { toast } from 'react-toastify';

const CustomVideoRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    duration: '30',
    style: 'realistic'
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/video-requests');
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Error loading requests:', error);
      toast.error('Failed to load video requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/video-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      toast.success('Video request submitted successfully');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        requirements: '',
        duration: '30',
        style: 'realistic'
      });
      await loadRequests();
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit video request');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Custom Video Requests</h2>
        <Button onClick={() => setShowForm(true)}>
          <FaPlus className="mr-2" />
          New Request
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="title"
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <Input
              id="description"
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              textarea
              required
            />
            <Input
              id="requirements"
              label="Special Requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              textarea
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (seconds)
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
                >
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="120">2 minutes</option>
                  <option value="180">3 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Style
                </label>
                <select
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
                >
                  <option value="realistic">Realistic</option>
                  <option value="artistic">Artistic</option>
                  <option value="animated">Animated</option>
                  <option value="abstract">Abstract</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading && !showForm ? (
        <div className="flex justify-center py-8">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : requests.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-400">No video requests yet</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {request.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{request.description}</p>
                  <div className="flex space-x-4 text-sm">
                    <span className="text-gray-400">
                      Duration: {request.duration}s
                    </span>
                    <span className="text-gray-400">
                      Style: {request.style}
                    </span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full ${getStatusColor(request.status)}`}>
                  {request.status}
                </div>
              </div>
              {request.feedback && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <p className="text-gray-300">{request.feedback}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomVideoRequests;