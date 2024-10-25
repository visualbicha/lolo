import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from './ui/Button';
import { firebaseService } from '../services/firebaseService';

const GoogleAuthButton = ({ isRegistration = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await firebaseService.loginWithGoogle();
      if (result?.user) {
        toast.success(`Successfully ${isRegistration ? 'registered' : 'logged in'} with Google`);
        navigate('/');
      }
    } catch (error) {
      console.error('Google Auth Error:', error);
      toast.error(error.message || 'Failed to authenticate with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleAuth}
      variant="secondary"
      className="w-full flex items-center justify-center gap-2"
      disabled={isLoading}
    >
      <FaGoogle className="text-lg" />
      <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
    </Button>
  );
};

export default GoogleAuthButton;