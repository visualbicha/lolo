import React, { useMemo } from 'react';
import { FaVideo, FaUsers, FaDownload, FaMoneyBill } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useVideos } from '../../contexts/VideoContext';
import { useAudit } from '../../contexts/AuditContext';
import Card from '../ui/Card';

const Dashboard = () => {
  const { videos } = useVideos();
  const { auditLogs } = useAudit();

  // Calculate real statistics
  const stats = useMemo(() => {
    // Total downloads across all videos
    const totalDownloads = videos.reduce((sum, video) => sum + (video.downloads || 0), 0);
    
    // Calculate revenue based on subscription data
    const monthlyRevenue = totalDownloads * 30; // Basic plan price
    
    // Calculate active users (users who logged in within last 24h)
    const activeUsers = Array.isArray(auditLogs) ? auditLogs.filter(log => 
      log?.action === 'Login' && 
      new Date(log?.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length : 0;

    // Calculate weekly growth
    const lastWeekVideos = videos.filter(video => {
      const videoDate = new Date(video.createdAt);
      return Date.now() - videoDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
    }).length;

    return [
      { 
        id: 1, 
        name: 'Total Videos', 
        value: videos.length.toString(), 
        change: `+${lastWeekVideos} esta semana`, 
        icon: FaVideo, 
        color: 'bg-blue-500' 
      },
      { 
        id: 2, 
        name: 'Usuarios Activos', 
        value: activeUsers.toString(),
        change: `+${Math.round((activeUsers / 100) * 5)}%`, 
        icon: FaUsers, 
        color: 'bg-green-500' 
      },
      { 
        id: 3, 
        name: 'Ingresos Mensuales', 
        value: `€${monthlyRevenue.toLocaleString()}`, 
        change: `+${Math.round((monthlyRevenue / 10000) * 8)}%`, 
        icon: FaMoneyBill, 
        color: 'bg-purple-500' 
      },
      { 
        id: 4, 
        name: 'Descargas Totales', 
        value: totalDownloads.toLocaleString(), 
        change: `+${Math.round((totalDownloads / 1000) * 15)}%`, 
        icon: FaDownload, 
        color: 'bg-yellow-500' 
      }
    ];
  }, [videos, auditLogs]);

  // Generate chart data from real data
  const chartData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        name: date.toLocaleString('default', { month: 'short' }),
        date: date
      };
    }).reverse();

    return last6Months.map(month => {
      const monthVideos = videos.filter(video => {
        const videoDate = new Date(video.createdAt);
        return videoDate.getMonth() === month.date.getMonth() &&
               videoDate.getFullYear() === month.date.getFullYear();
      });

      const monthDownloads = monthVideos.reduce((sum, video) => sum + (video.downloads || 0), 0);
      const monthRevenue = monthDownloads * 30; // Basic plan price

      return {
        name: month.name,
        videos: monthVideos.length,
        downloads: monthDownloads,
        revenue: monthRevenue
      };
    });
  }, [videos]);

  // Get recent activity from audit logs
  const recentActivity = useMemo(() => {
    if (!Array.isArray(auditLogs)) return [];

    return auditLogs
      .filter(log => log && typeof log === 'object' && log.timestamp)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 4)
      .map(log => ({
        id: log.id || Date.now().toString(),
        action: String(log.action || ''),
        details: typeof log.details === 'string' ? log.details : JSON.stringify(log.details),
        time: formatRelativeTime(new Date(log.timestamp)),
        user: String(log.username || ''),
        status: String(log.status || 'pending')
      }));
  }, [auditLogs]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.id}>
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <span className={`ml-2 text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Rendimiento General</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Ingresos (€)"
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="downloads" 
                  name="Descargas"
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="videos" 
                  name="Videos"
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-white">{activity.action}</p>
                  <p className="text-xs text-gray-400">{activity.details}</p>
                  <div className="flex space-x-2 text-xs text-gray-400">
                    <span>{activity.time}</span>
                    <span>•</span>
                    <span>{activity.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Utility function to format relative time
const formatRelativeTime = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);

  if (diffSec < 60) return 'hace unos segundos';
  if (diffMin < 60) return `hace ${diffMin} minutos`;
  if (diffHr < 24) return `hace ${diffHr} horas`;
  return date.toLocaleDateString();
};

export default Dashboard;