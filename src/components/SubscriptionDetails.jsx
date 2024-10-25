import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaCalendarAlt, FaArrowUp } from 'react-icons/fa';

const SubscriptionDetails = () => {
  const { user } = useAuth();

  return (
    <div>
      <p className="text-lg text-gray-300 mb-4">
        Current Plan: <span className="font-bold text-white">{user?.plan || 'Free'}</span>
      </p>
      <p className="text-lg text-gray-300 mb-4 flex items-center">
        <FaCalendarAlt className="mr-2" />
        Next Renewal: <span className="font-bold text-white ml-2">July 1, 2023</span>
      </p>
      <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300 flex items-center">
        <FaArrowUp className="mr-2" />
        Upgrade Plan
      </button>
    </div>
  );
};

export default SubscriptionDetails;