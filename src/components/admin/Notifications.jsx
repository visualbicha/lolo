import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTimes, FaEye, FaSpinner } from 'react-icons/fa';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { toast } from 'react-toastify';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Simular carga de notificaciones
      const mockNotifications = [
        {
          id: 1,
          type: 'video_request',
          title: 'Nueva solicitud de video',
          message: 'El usuario John Doe ha solicitado un video personalizado',
          status: 'unread',
          priority: 'high',
          timestamp: new Date().toISOString(),
          data: {
            requestId: '123',
            userId: '456',
            videoTitle: 'Atardecer en la playa'
          }
        },
        {
          id: 2,
          type: 'subscription',
          title: 'Nueva suscripción Pro',
          message: 'Jane Smith se ha suscrito al plan Pro',
          status: 'unread',
          priority: 'medium',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => n.status === 'unread').length);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Error al cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId ? { ...notif, status: 'read' } : notif
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success('Notificación marcada como leída');
    } catch (error) {
      toast.error('Error al marcar la notificación como leída');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(notif => ({ ...notif, status: 'read' })));
      setUnreadCount(0);
      toast.success('Todas las notificaciones marcadas como leídas');
    } catch (error) {
      toast.error('Error al marcar las notificaciones como leídas');
    }
  };

  const handleAction = async (notification) => {
    try {
      switch (notification.type) {
        case 'video_request':
          // Navegar a la página de solicitudes de video
          window.location.href = `/admin/custom-requests/${notification.data.requestId}`;
          break;
        case 'subscription':
          // Navegar a la página de suscripciones
          window.location.href = '/admin/subscriptions';
          break;
        default:
          console.warn('Tipo de notificación no manejado:', notification.type);
      }
    } catch (error) {
      toast.error('Error al procesar la acción');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center p-8">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
          <span className="ml-2 text-white">Cargando notificaciones...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <FaBell className="mr-2" />
          Notificaciones
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {unreadCount}
            </span>
          )}
        </h2>
        {notifications.length > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            variant="secondary"
            disabled={unreadCount === 0}
          >
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-400">No hay notificaciones nuevas</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`transition-colors duration-200 ${
                notification.status === 'unread' ? 'bg-gray-700' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-white">
                      {notification.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs text-white ${
                      getPriorityColor(notification.priority)
                    }`}>
                      {notification.priority}
                    </span>
                    {notification.status === 'unread' && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-gray-400 mt-1">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleAction(notification)}
                  >
                    <FaEye className="mr-2" />
                    Ver
                  </Button>
                  {notification.status === 'unread' && (
                    <Button
                      variant="success"
                      size="small"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <FaCheck className="mr-2" />
                      Marcar como leída
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;