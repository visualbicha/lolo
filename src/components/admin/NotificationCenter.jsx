import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { FaBell, FaCheck, FaSpinner } from 'react-icons/fa';
import Card from '../ui/Card';
import Button from '../ui/Button';

const NotificationCenter = () => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

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
          Centro de Notificaciones
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {unreadCount}
            </span>
          )}
        </h2>
        {notifications.length > 0 && (
          <Button
            onClick={markAllAsRead}
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
            <p className="text-gray-400">No hay notificaciones</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`transition-colors duration-200 ${
                !notification.read ? 'bg-gray-700' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-white">
                      {notification.type === 'video_request' ? 'Nueva Solicitud de Video' :
                       notification.type === 'subscription' ? 'Nueva Suscripción' :
                       'Notificación'}
                    </h3>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-gray-400 mt-1">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <Button
                    variant="success"
                    size="small"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <FaCheck className="mr-2" />
                    Marcar como leída
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;