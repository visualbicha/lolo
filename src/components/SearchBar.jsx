import React, { useState, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';
import Input from './ui/Input';
import Button from './ui/Button';
import { debounce } from 'lodash';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search to avoid too many requests
  const debouncedSearch = useCallback(
    debounce((term) => {
      onSearch(term);
    }, 300),
    [onSearch]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full gap-2">
      <div className="relative flex-grow">
        <Input
          id="search-input"
          type="text"
          placeholder="Buscar videos..."
          value={searchTerm}
          onChange={handleChange}
          className="pl-10 w-full"
          autoComplete="off"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <Button type="submit" variant="primary">
        Buscar
      </Button>
    </form>
  );
};

export default SearchBar;