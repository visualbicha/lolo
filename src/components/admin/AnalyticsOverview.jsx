import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';

const AnalyticsOverview = () => {
  const data = [
    { name: 'Jan', users: 4000, videos: 2400, revenue: 2400 },
    { name: 'Feb', users: 3000, videos: 1398, revenue: 2210 },
    { name: 'Mar', users: 2000, videos: 9800, revenue: 2290 },
    { name: 'Apr', users: 2780, videos: 3908, revenue: 2000 },
    { name: 'May', users: 1890, videos: 4800, revenue: 2181 },
    { name: 'Jun', users: 2390, videos: 3800, revenue: 2500 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Analytics Overview</h2>
      <Card className="mb-8">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="videos" stroke="#82ca9d" />
            <Line type="monotone" dataKey="revenue" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h3 className="text-lg font-semibold mb-2 text-white">Active Users</h3>
          <p className="text-3xl font-bold text-blue-500">8,234</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-2 text-white">Generated Videos</h3>
          <p className="text-3xl font-bold text-green-500">12,456</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-2 text-white">Monthly Revenue</h3>
          <p className="text-3xl font-bold text-yellow-500">$15,789</p>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsOverview;