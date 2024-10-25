import React, { useState, useEffect } from 'react';
import { FaClock, FaCheck, FaSpinner, FaTimes } from 'react-icons/fa';
import Card from './ui/Card';

const RequestStatus = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Simulación de carga de solicitudes
    setRequests([
      {
        id: 1,
        title: 'Atardecer en la playa',
        status: 'completed',
        createdAt: '2023-12-01T10:00:00Z',
        completedAt: '2023-12-02T15:30:00Z',
        videoUrl: 'https://example.com/video1.mp4'
      },
      {
        id: 2,
        title: 'Ciudad futurista',
        status: 'processing',
        createdAt: '2023-12-03T14:20:00Z',
        estimatedCompletion: '2023-12-04T14:20:00Z'
      },
      {
        id: 3,
        title: 'Montañas nevadas',
        status: 'pending',
        createdAt: '2023-12-03T16:45:00Z'
      }
    ]);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheck className="text-green-500" />;
      case 'processing':
        return <FaSpinner className="animate-spin text-blue-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'rejected':
        return <FaTimes className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'processing':
        return 'En proceso';
      case 'pending':
        return 'Pendiente';
      case 'rejected':
        return 'Rechazado';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-white mb-6">Estado de tus Solicitudes</h3>

      {requests.length === 0 ? (
        <p className="text-gray-400 text-center">No hay solicitudes activas</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-gray-700 rounded-lg p-4 transition-colors duration-200 hover:bg-gray-600"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {request.title}
                  </h4>
                  <div className="space-y-1 text-sm text-gray-400">
                    <p>Solicitado: {formatDate(request.createdAt)}</p>
                    {request.completedAt && (
                      <p>Completado: {formatDate(request.completedAt)}</p>
                    )}
                    {request.estimatedCompletion && (
                      <p>Estimado: {formatDate(request.estimatedCompletion)}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(request.status)}
                  <span className={`text-sm ${
                    request.status === 'completed' ? 'text-green-400' :
                    request.status === 'processing' ? 'text-blue-400' :
                    request.status === 'rejected' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {getStatusText(request.status)}
                  </span>
                </div>
              </div>

              {request.status === 'completed' && request.videoUrl && (
                <div className="mt-4">
                  <video
                    src={request.videoUrl}
                    controls
                    className="w-full rounded"
                  >
                    Tu navegador no soporta el elemento video.
                  </video>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RequestStatus;