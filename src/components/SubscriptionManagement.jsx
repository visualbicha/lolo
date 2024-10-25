import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SubscriptionManagement = () => {
  const { user, setHasSubscription } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCancelSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: user.subscriptionId, // Assume this is stored in the user object
        }),
      });

      const { status } = await response.json();

      if (status === 'canceled') {
        setHasSubscription(false);
        alert('Subscription successfully canceled');
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-white mb-4">Manage Your Subscription</h3>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <button
        className={`py-2 px-4 rounded transition duration-300 ${
          loading ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'
        }`}
        onClick={handleCancelSubscription}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Cancel Subscription'}
      </button>
    </div>
  );
};

export default SubscriptionManagement;