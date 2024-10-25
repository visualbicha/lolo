import React from 'react';
import { FaVideo, FaUsers, FaEye, FaDownload } from 'react-icons/fa';
import Card from './ui/Card';

const stats = [
  { id: 1, name: 'Videos', value: '10,000+', icon: FaVideo },
  { id: 2, name: 'Users', value: '50,000+', icon: FaUsers },
  { id: 3, name: 'Categories', value: '100+', icon: FaEye },
  { id: 4, name: 'Total Views', value: '5M+', icon: FaDownload },
];

const Stats = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <Card key={stat.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <stat.icon className="text-4xl text-blue-500 opacity-75" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;