import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaPlay, FaPause, FaDownload, FaCrown, FaImage } from 'react-icons/fa';
import Button from './ui/Button';
import Card from './ui/Card';
import { toast } from 'react-toastify';

const VideoCard = ({ video, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const videoRef = useRef(null);

  const hasActiveSubscription = user?.subscription?.status === 'active';

  useEffect(() => {
    // Limpiar el video cuando el componente se desmonta
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
        videoRef.current.load();
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && !hasError) {
      // Cargar el video solo cuando se hace hover
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Error playing video:', error);
            setHasError(true);
          });
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleVideoLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleVideoError = () => {
    console.error('Video error:', video.id);
    setHasError(true);
    setIsLoaded(true);
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!hasActiveSubscription) {
      navigate('/subscription');
      return;
    }

    try {
      setDownloading(true);
      const response = await fetch(video.downloadUrl);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${video.title}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Video descargado correctamente');
    } catch (error) {
      console.error('Error downloading video:', error);
      toast.error('Error al descargar el video');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card className="group transition-transform duration-300 hover:-translate-y-1">
      <div 
        className="relative aspect-video cursor-pointer overflow-hidden rounded-t-lg"
        onClick={() => navigate(`/videos/${video.id}`)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {!hasError && (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            poster={video.thumbnail}
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
          >
            <source src={video.previewUrl} type="video/mp4" />
            Tu navegador no soporta el elemento video.
          </video>
        )}

        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500"></div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <img 
              src={video.thumbnail} 
              alt={video.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x225?text=Video+Not+Available';
              }}
            />
          </div>
        )}

        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isHovered ? 'bg-opacity-30' : 'bg-opacity-50'
        }`}>
          <div className="absolute inset-0 flex items-center justify-center">
            {!hasError && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isPlaying) {
                    videoRef.current?.pause();
                  } else {
                    videoRef.current?.play().catch(() => setHasError(true));
                  }
                  setIsPlaying(!isPlaying);
                }}
                className="text-white hover:text-blue-500 transition-colors duration-300"
                aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
              >
                {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
              </button>
            )}
          </div>
        </div>

        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs text-white">
          {video.duration}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{video.title}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{video.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {video.tags?.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            <span>{video.quality}</span>
          </div>
          {isAuthenticated ? (
            hasActiveSubscription ? (
              <Button
                variant="success"
                size="small"
                onClick={handleDownload}
                disabled={downloading}
              >
                <FaDownload className="mr-2" />
                {downloading ? 'Descargando...' : 'Descargar'}
              </Button>
            ) : (
              <Button 
                variant="primary" 
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/subscription');
                }}
              >
                <FaCrown className="mr-2" />
                Suscribirse
              </Button>
            )
          ) : (
            <Button 
              variant="secondary" 
              size="small"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Iniciar Sesión
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;