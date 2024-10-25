import React, { useState, useEffect } from 'react';
import { useVideos } from '../contexts/VideoContext';
import { FaThLarge, FaList, FaFilter, FaSort, FaSearch, FaTimes } from 'react-icons/fa';
import SearchBar from '../components/SearchBar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Pagination from '../components/Pagination';
import VideoCard from '../components/VideoCard';
import { motion, AnimatePresence } from 'framer-motion';

const Videos = () => {
  const { videos, loading, error } = useVideos();
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    duration: 'all',
    sortBy: 'newest'
  });
  const [activeFilters, setActiveFilters] = useState(0);

  useEffect(() => {
    if (videos) {
      applyFilters();
    }
  }, [videos, filters]);

  const applyFilters = () => {
    let filtered = [...videos];
    let activeCount = 0;

    if (filters.category !== 'all') {
      filtered = filtered.filter(video => video.category === filters.category);
      activeCount++;
    }

    if (filters.duration !== 'all') {
      filtered = filtered.filter(video => {
        const duration = parseInt(video.duration);
        switch (filters.duration) {
          case 'short': return duration <= 30;
          case 'medium': return duration > 30 && duration <= 120;
          case 'long': return duration > 120;
          default: return true;
        }
      });
      activeCount++;
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'downloads':
          return (b.downloads || 0) - (a.downloads || 0);
        default:
          return 0;
      }
    });
    if (filters.sortBy !== 'newest') activeCount++;

    setActiveFilters(activeCount);
    setFilteredVideos(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (searchTerm) => {
    const filtered = videos.filter(video => 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredVideos(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      duration: 'all',
      sortBy: 'newest'
    });
    setShowFilters(false);
  };

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <Card>
          <p className="text-red-500 text-center">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-white mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Explora Nuestra Colección
        </motion.h1>

        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-grow w-full">
                <SearchBar onSearch={handleSearch} />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant={showFilters ? "primary" : "secondary"}
                  aria-expanded={showFilters}
                  aria-controls="filter-panel"
                >
                  <FaFilter className="mr-2" />
                  Filtros
                  {activeFilters > 0 && (
                    <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                      {activeFilters}
                    </span>
                  )}
                </Button>
                <Button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  variant="secondary"
                  aria-label={`Cambiar a vista ${viewMode === 'grid' ? 'lista' : 'cuadrícula'}`}
                >
                  {viewMode === 'grid' ? <FaList /> : <FaThLarge />}
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  id="filter-panel"
                  className="mt-6 border-t border-gray-700 pt-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="category">
                        Categoría
                      </label>
                      <select
                        id="category"
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">Todas las categorías</option>
                        <option value="nature">Naturaleza</option>
                        <option value="urban">Urbano</option>
                        <option value="technology">Tecnología</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="duration">
                        Duración
                      </label>
                      <select
                        id="duration"
                        value={filters.duration}
                        onChange={(e) => handleFilterChange('duration', e.target.value)}
                        className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">Todas las duraciones</option>
                        <option value="short">Corto (&lt; 30s)</option>
                        <option value="medium">Medio (30s - 2min)</option>
                        <option value="long">Largo (&gt; 2min)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="sortBy">
                        Ordenar por
                      </label>
                      <select
                        id="sortBy"
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="newest">Más recientes</option>
                        <option value="oldest">Más antiguos</option>
                        <option value="downloads">Más descargados</option>
                      </select>
                    </div>
                  </div>
                  {activeFilters > 0 && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={resetFilters}
                        className="text-sm"
                      >
                        <FaTimes className="mr-2" />
                        Limpiar filtros
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {filteredVideos.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <FaSearch className="mx-auto text-4xl text-gray-500 mb-4" />
              <p className="text-gray-400 text-lg">No se encontraron videos que coincidan con tu búsqueda</p>
              <Button onClick={resetFilters} className="mt-4">
                Limpiar filtros
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="text-gray-400 mb-4">
              {filteredVideos.length} {filteredVideos.length === 1 ? 'video encontrado' : 'videos encontrados'}
            </div>
            <motion.div 
              className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {currentVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <VideoCard
                    video={video}
                    viewMode={viewMode}
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        {filteredVideos.length > videosPerPage && (
          <div className="mt-12">
            <Pagination
              itemsPerPage={videosPerPage}
              totalItems={filteredVideos.length}
              currentPage={currentPage}
              paginate={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;