import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import Input from './ui/Input';

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [resolution, setResolution] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      q: searchTerm,
      category,
      duration,
      resolution
    }).toString();
    navigate(`/videos?${queryParams}`);
  };

  return (
    <section className="py-24 px-4 bg-gray-800">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Find Your Perfect Video</h2>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex items-center">
            <Input
              id="search-input"
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow rounded-r-none"
            />
            <Button type="submit" className="rounded-l-none">
              Search
            </Button>
          </div>
          {/* Rest of the component remains unchanged */}
        </form>
      </div>
    </section>
  );
};

export default SearchSection;