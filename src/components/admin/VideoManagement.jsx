import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideos } from '../../contexts/VideoContext';
import { useAudit } from '../../contexts/AuditContext';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaSpinner, FaPlay, FaPause } from 'react-icons/fa';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import VideoUploadForm from './VideoUploadForm';
import { toast } from 'react-toastify';

const VideoManagement = () => {
  const navigate = useNavigate();
  const { videos, loading, error, deleteVideo } = useVideos();
  const { addAuditLog } = useAudit();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [deletingVideoId, setDeletingVideoId] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    if (videos) {
      setFilteredVideos(
        videos.filter(video =>
          video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.category?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [videos, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este video?')) {
      return;
    }

    setDeletingVideoId(videoId);
    try {
      await deleteVideo(videoId);
      await addAuditLog('Video Delete', {
        videoId,
        action: 'delete',
        status: 'success'
      });
      toast.success('Video eliminado correctamente');
      setFilteredVideos(prev => prev.filter(v => v.id !== videoId));
    } catch (error) {
      console.error('Error al eliminar video:', error);
      await addAuditLog('Video Delete Failed', {
        videoId,
        error: error.message,
        status: 'error'
      });
      toast.error('Error al eliminar el video');
    } finally {
      setDeletingVideoId(null);
    }
  };

  const handleEdit = (video) => {
    navigate(`/admin/videos/edit/${video.id}`);
  };

  const toggleVideoPlay = (videoId) => {
    setPlayingVideoId(playingVideoId === videoId ? null : videoId);
  };

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    toast.success('Video añadido correctamente');
  };

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center p-8">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
          <span className="ml-2 text-white">Cargando videos...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center text-red-500 p-4">
          <p>Error al cargar los videos:</p>
          <p>{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="secondary"
          >
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  if (showUploadForm) {
    return <VideoUploadForm onSuccess={handleUploadSuccess} onCancel={() => setShowUploadForm(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestión de Videos</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Input
              id="search-videos"
              type="text"
              placeholder="Buscar videos..."
              value={searchTerm}
              onChange={handleSearch}
              className="min-w-[300px]"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Button onClick={() => setShowUploadForm(true)}>
            <FaPlus className="mr-2" />
            Añadir Video
          </Button>
        </div>
      </div>

      {filteredVideos.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">
              {searchTerm ? 'No se encontraron videos que coincidan con tu búsqueda' : 'No hay videos disponibles'}
            </p>
            <Button onClick={() => setShowUploadForm(true)}>
              Subir Primer Video
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="p-6">
              <div className="flex gap-6">
                <div className="w-64 h-36 relative rounded-lg overflow-hidden group">
                  <video
                    src={video.previewUrl}
                    poster={video.thumbnail}
                    className="w-full h-full object-cover"
                    controls={playingVideoId === video.id}
                    muted
                    loop
                    playsInline
                    autoPlay={playingVideoId === video.id}
                  />
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => toggleVideoPlay(video.id)}
                  >
                    <Button variant="secondary" size="small">
                      {playingVideoId === video.id ? <FaPause /> : <FaPlay />}
                    </Button>
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {video.title}
                      </h3>
                      <p className="text-gray-400 mb-2 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {video.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-700 text-sm text-gray-300 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-400">
                        <span className="mr-4">Categoría: {video.category}</span>
                        <span className="mr-4">Duración: {video.duration}</span>
                        <span>Calidad: {video.quality}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleEdit(video)}
                        disabled={deletingVideoId === video.id}
                      >
                        <FaEdit className="mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(video.id)}
                        disabled={deletingVideoId === video.id}
                      >
                        {deletingVideoId === video.id ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            Eliminando...
                          </>
                        ) : (
                          <>
                            <FaTrash className="mr-2" />
                            Eliminar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoManagement;