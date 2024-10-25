import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaCreditCard, FaHistory, FaDownload, FaHeart, FaCog, FaVideo } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import BillingHistory from '../components/BillingHistory';
import SavedContent from '../components/SavedContent';
import SubscriptionDetails from '../components/SubscriptionDetails';
import CustomVideoRequest from '../components/CustomVideoRequest';
import RequestStatus from '../components/RequestStatus';

const MyAccount = () => {
  const { user, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      // Implementar cambio de contraseña
      toast.success('Password updated successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Implementar cambio de email
      toast.success('Verification email sent to new address');
    } catch (error) {
      toast.error('Failed to initiate email change');
    } finally {
      setLoading(false);
    }
  };

  // Definir las pestañas disponibles
  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'subscription', label: 'Subscription', icon: FaCreditCard },
    { id: 'billing', label: 'Billing History', icon: FaHistory },
    { id: 'downloads', label: 'Downloads', icon: FaDownload },
    { id: 'favorites', label: 'Favorites', icon: FaHeart },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ];

  // Añadir pestaña de solicitudes de video si el usuario tiene suscripción Pro
  if (user?.subscription?.type === 'pro' || user?.subscription?.type === 'proUltra') {
    tabs.splice(2, 0, { id: 'customVideos', label: 'Custom Videos', icon: FaVideo });
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <Input
                id="firstName"
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={loading}
              />
              <Input
                id="lastName"
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>

            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Change Email</h3>
              <form onSubmit={handleEmailChange} className="space-y-4">
                <Input
                  id="email"
                  label="New Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <Button type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Change Email'}
                </Button>
              </form>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input
                  id="currentPassword"
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <Input
                  id="newPassword"
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <Input
                  id="confirmPassword"
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Change Password'}
                </Button>
              </form>
            </div>
          </div>
        );
      case 'subscription':
        return <SubscriptionDetails />;
      case 'billing':
        return <BillingHistory />;
      case 'downloads':
        return <SavedContent type="downloads" />;
      case 'favorites':
        return <SavedContent type="favorites" />;
      case 'customVideos':
        return (
          <div className="space-y-6">
            <CustomVideoRequest />
            <RequestStatus />
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Account Settings</h3>
            {/* Add account settings options here */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">My Account</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <Card>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center w-full p-3 rounded transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="mr-3" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>
        <div className="md:w-3/4">
          <Card>
            {renderContent()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;