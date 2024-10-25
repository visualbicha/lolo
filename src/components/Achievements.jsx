import React from 'react';
import { FaStar, FaVideo, FaDownload } from 'react-icons/fa';

const Achievements = () => {
  const achievements = [
    { id: 1, name: 'First Download', icon: FaDownload, completed: true },
    { id: 2, name: 'Watch 10 Videos', icon: FaVideo, completed: false },
    { id: 3, name: 'Premium Member', icon: FaStar, completed: true },
  ];

  return (
    <ul className="space-y-4">
      {achievements.map((achievement) => (
        <li key={achievement.id} className={`flex items-center ${achievement.completed ? 'text-green-400' : 'text-gray-400'}`}>
          <achievement.icon className="mr-2" />
          <span>{achievement.name}</span>
          {achievement.completed && <FaStar className="ml-auto text-yellow-400" />}
        </li>
      ))}
    </ul>
  );
};

export default Achievements;