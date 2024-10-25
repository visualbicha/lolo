import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaSpinner, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { toast } from 'react-toastify';

const VideoRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      // Simular carga de solicitudes
      const mockRequests = [
        {
          id: 1,
          title: 'Atardecer en la playa',
          description: 'Video de un atardecer con olas suaves...',
          status: 'pending',
          priority: 'high',
          createdAt: new Date().toISOString(),
          user: {
            name: 'John Doe',
            subscription: 'proUltra',
            email: 'john@example.com'
          },
          requirements: 'Formato vertical, estilo cinematográfico'
        },
        {
          id: 2,
          title: 'Ciudad futurista',
          description: 'Ciudad moderna con elementos futuristas...',
          status: 'processing',
          priority: 'normal',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          user: {
            name: 'Jane Smith',
            subscription: 'pro10',
            email: 'jane@example.com'
          },
          requirements: 'Resolución 4K, duración 1 minuto'
        }
      ];

      setRequests(mockRequests);
    } catch (error) {
      toast.error('Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ));
      toast.success(`Estado actualizado a: ${newStatus}`);
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  const handlePriorityChange = async (requestId, newPriority) => {
    try {
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, priority: newPriority } : req
      ));
      toast.success(`Prioridad actualizada a: ${newPriority}`);
    } catch (error) {
      toast.error('Error al actualizar la prioridad');
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-blue-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'normal':
        return 'bg-blue-500';
      case 'low':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center p-8">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
          <span className="ml-2 text-white">Cargando solicitudes...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestión de Solicitudes</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-700 text-white rounded-lg px-4 py-2"
        >
          <option value="all">Todas las solicitudes</option>
          <option value="pending">Pendientes</option>
          <option value="processing">En proceso</option>
          <option value="completed">Completadas</option>
          <option value="rejected">Rechazadas</option>
        </select>
      </div>

      {filteredRequests.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-400">No hay solicitudes {filter !== 'all' ? 'en este estado' : ''}</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id}>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-xl font-semibold text-white">
                      {request.title}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs text-white ${getStatusBadgeColor(request.status)}`}>
                      {request.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs text-white ${getPriorityBadgeColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </div>
                  <p className="text-gray-400">{request.description}</p>
                  <div className="text-sm text-gray-400">
                    <p>Usuario: {request.user.name} ({request.user.subscription})</p>
                    <p>Email: {request.user.email}</p>
                    <p>Requisitos: {request.requirements}</p>
                    <p>Solicitado: {new Date(request.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {request.status === 'pending' && (
                    <>
                      <Button
                        variant="success"
                        size="small"
                        onClick={() => handleStatusChange(request.id, 'processing')}
                      >
                        <FaCheck className="mr-2" />
                        Aprobar
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleStatusChange(request.id, 'rejected')}
                      >
                        <FaTimes className="mr-2" />
                        Rechazar
                      </Button>
                    </>
                  )}

                  {request.status === 'processing' && (
                    <Button
                      variant="success"
                      size="small"
                      onClick={() => handleStatusChange(request.id, 'completed')}
                    >
                      <FaCheck className="mr-2" />
                      Completar
                    </Button>
                  )}

                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handlePriorityChange(request.id, 'high')}
                      disabled={request.priority === 'high'}
                    >
                      <FaArrowUp className="mr-2" />
                      Alta
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handlePriorityChange(request.id, 'normal')}
                      disabled={request.priority === 'normal'}
                    >
                      <FaArrowDown className="mr-2" />
                      Normal
                    </Button>
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

export default VideoRequestManagement;