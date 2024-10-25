import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaDownload, FaChartLine, FaUsers, FaVideo } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useVideos } from '../../contexts/VideoContext';

const Analytics = () => {
  const { videos } = useVideos();
  const [dateRange, setDateRange] = useState('week');
  const [exportFormat, setExportFormat] = useState('pdf');

  // Simulated analytics data
  const analyticsData = {
    views: 156789,
    users: 12543,
    downloads: 8976,
    revenue: 45678.90,
    chartData: [
      { date: '2023-01', views: 15000, downloads: 1200, revenue: 4500 },
      { date: '2023-02', views: 18000, downloads: 1500, revenue: 5200 },
      { date: '2023-03', views: 22000, downloads: 1800, revenue: 6100 },
      { date: '2023-04', views: 25000, downloads: 2100, revenue: 7300 },
      { date: '2023-05', views: 28000, downloads: 2400, revenue: 8200 },
      { date: '2023-06', views: 32000, downloads: 2700, revenue: 9100 }
    ]
  };

  const exportData = async () => {
    try {
      const data = {
        summary: {
          totalViews: analyticsData.views,
          totalUsers: analyticsData.users,
          totalDownloads: analyticsData.downloads,
          totalRevenue: analyticsData.revenue
        },
        details: analyticsData.chartData
      };

      if (exportFormat === 'pdf') {
        await exportToPDF(data);
      } else {
        await exportToExcel(data);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const exportToPDF = async (data) => {
    try {
      // Simulación de exportación a PDF
      console.log('Exporting to PDF:', data);
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const exportToExcel = async (data) => {
    try {
      // Simulación de exportación a Excel
      console.log('Exporting to Excel:', data);
      toast.success('Excel file exported successfully');
    } catch (error) {
      console.error('Error generating Excel:', error);
      toast.error('Failed to generate Excel file');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <div className="flex space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-gray-700 text-white rounded-lg px-4 py-2"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="bg-gray-700 text-white rounded-lg px-4 py-2"
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
          </select>
          <Button onClick={exportData}>
            <FaDownload className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <FaChartLine className="text-4xl text-blue-500 mr-4" />
            <div>
              <p className="text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-white">{analyticsData.views.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <FaUsers className="text-4xl text-green-500 mr-4" />
            <div>
              <p className="text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-white">{analyticsData.users.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <FaDownload className="text-4xl text-purple-500 mr-4" />
            <div>
              <p className="text-gray-400">Downloads</p>
              <p className="text-2xl font-bold text-white">{analyticsData.downloads.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <FaVideo className="text-4xl text-yellow-500 mr-4" />
            <div>
              <p className="text-gray-400">Total Videos</p>
              <p className="text-2xl font-bold text-white">{videos.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-xl font-bold text-white mb-6">Performance Overview</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
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
                dataKey="views"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="downloads"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;