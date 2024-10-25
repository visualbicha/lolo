import React from 'react';
import { FaChartBar, FaUsers, FaFolderOpen, FaMoneyBillWave, FaClipboardList, FaCog, FaFlag, FaVideo, FaCreditCard, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';

const Sidebar = ({ activeTab, setActiveTab, isOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartBar },
    { id: 'analytics', label: 'Analytics', icon: FaChartLine },
    { id: 'users', label: 'Usuarios', icon: FaUsers },
    { id: 'videos', label: 'Videos', icon: FaVideo },
    { id: 'categories', label: 'Categorías', icon: FaFolderOpen },
    { id: 'subscriptions', label: 'Suscripciones', icon: FaMoneyBillWave },
    { id: 'stripe', label: 'Stripe', icon: FaCreditCard },
    { id: 'security', label: 'Seguridad', icon: FaShieldAlt },
    { id: 'reports', label: 'Reportes', icon: FaFlag },
    { id: 'audit', label: 'Audit Log', icon: FaClipboardList },
    { id: 'settings', label: 'Configuración', icon: FaCog },
  ];

  return (
    <div className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
      <nav>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left py-2.5 px-4 rounded transition duration-200 ${
              activeTab === item.id ? 'bg-blue-500' : 'hover:bg-gray-700'
            }`}
          >
            <item.icon className="inline-block mr-2" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

Sidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default Sidebar;