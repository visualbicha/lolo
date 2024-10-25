import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBars } from 'react-icons/fa';
import Sidebar from '../components/admin/Sidebar';
import Dashboard from '../components/admin/Dashboard';
import UserManagement from '../components/admin/UserManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import SubscriptionManagement from '../components/admin/SubscriptionManagement';
import AuditLog from '../components/admin/AuditLog';
import Settings from '../components/admin/Settings';
import ReportManagement from '../components/admin/ReportManagement';
import VideoManagement from '../components/admin/VideoManagement';
import StripeSettings from '../components/admin/StripeSettings';
import SecurityManagement from '../components/admin/SecurityManagement';
import Analytics from '../components/admin/Analytics';
import VideoRequestManagement from '../components/admin/VideoRequestManagement';
import NotificationCenter from '../components/admin/NotificationCenter';

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'subscriptions':
        return <SubscriptionManagement />;
      case 'audit':
        return <AuditLog />;
      case 'settings':
        return <Settings />;
      case 'reports':
        return <ReportManagement />;
      case 'videos':
        return <VideoManagement />;
      case 'stripe':
        return <StripeSettings />;
      case 'security':
        return <SecurityManagement />;
      case 'analytics':
        return <Analytics />;
      case 'requests':
        return <VideoRequestManagement />;
      case 'notifications':
        return <NotificationCenter />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="text-2xl p-2 hover:bg-gray-700 rounded"
          >
            <FaBars />
          </button>
          <div className="text-lg font-semibold">Admin Panel</div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Admin;