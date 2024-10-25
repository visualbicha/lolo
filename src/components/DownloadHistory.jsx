import React, { useState } from 'react';
import { FaDownload, FaCalendarAlt, FaEye, FaSearch } from 'react-icons/fa';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';

const DownloadHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [downloads] = useState([
    {
      id: 1,
      videoTitle: 'Ocean Waves',
      downloadDate: new Date().toISOString(),
      fileSize: '250MB',
      quality: '4K',
      downloadUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    },
    {
      id: 2,
      videoTitle: 'City Life',
      downloadDate: new Date(Date.now() - 86400000).toISOString(),
      fileSize: '180MB',
      quality: '1080p',
      downloadUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    }
  ]);

  const filteredDownloads = downloads.filter(download =>
    download.videoTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (downloadUrl, videoTitle) => {
    window.open(downloadUrl, '_blank');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Historial de Descargas</h3>
        <div className="relative w-64">
          <Input
            id="search-downloads"
            type="text"
            placeholder="Buscar descargas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {filteredDownloads.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-400">No se encontraron descargas</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDownloads.map((download) => (
            <Card key={download.id} className="hover:bg-gray-700 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <h4 className="text-lg font-medium text-white mb-2">
                    {download.videoTitle}
                  </h4>
                  <div className="flex items-center text-sm text-gray-400 space-x-4">
                    <span className="flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      {formatDate(download.downloadDate)}
                    </span>
                    <span>{download.fileSize}</span>
                    <span>{download.quality}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => window.open(`/videos/${download.id}`, '_blank')}
                  >
                    <FaEye className="mr-2" />
                    Ver Video
                  </Button>
                  <Button
                    onClick={() => handleDownload(download.downloadUrl, download.videoTitle)}
                    size="small"
                  >
                    <FaDownload className="mr-2" />
                    Descargar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DownloadHistory;