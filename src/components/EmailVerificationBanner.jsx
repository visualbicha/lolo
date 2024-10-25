import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { firebaseService } from '../services/firebaseService';
import Button from './ui/Button';

const EmailVerificationBanner = () => {
  const { user } = useAuth();

  if (!user || user.emailVerified) {
    return null;
  }

  const handleResendVerification = async () => {
    try {
      await firebaseService.resendVerificationEmail(user);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      toast.error('Failed to send verification email. Please try again later.');
    }
  };

  return (
    <div className="bg-yellow-500 text-yellow-900 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <p>
          Please verify your email address to access all features.
          Haven't received the email?
        </p>
        <Button
          onClick={handleResendVerification}
          variant="secondary"
          size="small"
          className="ml-4"
        >
          Resend Verification
        </Button>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;