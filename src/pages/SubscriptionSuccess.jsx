import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaCheckCircle } from 'react-icons/fa';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const { setHasSubscription } = useAuth();

  useEffect(() => {
    setHasSubscription(true);
  }, [setHasSubscription]);

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-lg mx-auto text-center">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">¡Suscripción Activada!</h1>
        <p className="text-gray-400 mb-8">
          Tu suscripción se ha activado correctamente. Ya puedes disfrutar de todas las funcionalidades premium.
        </p>
        <Button onClick={() => navigate('/videos')} className="w-full">
          Explorar Videos
        </Button>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;