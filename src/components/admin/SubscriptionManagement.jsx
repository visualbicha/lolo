import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, name: 'Basic', price: 9.99, features: ['HD videos', '10 downloads/month'] },
    { id: 2, name: 'Pro', price: 19.99, features: ['4K videos', 'Unlimited downloads'] },
    { id: 3, name: 'Enterprise', price: 49.99, features: ['Custom features', 'Priority support'] }
  ]);

  const handleAddSubscription = () => {
    toast.info('Subscription creation feature coming soon');
  };

  const handleEditSubscription = (id) => {
    toast.info('Subscription editing feature coming soon');
  };

  const handleDeleteSubscription = (id) => {
    if (window.confirm('Are you sure you want to delete this subscription plan?')) {
      setSubscriptions(subscriptions.filter(sub => sub.id !== id));
      toast.success('Subscription plan deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Subscription Plans</h2>
        <Button onClick={handleAddSubscription}>
          <FaPlus className="mr-2" />
          Add Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.map((subscription) => (
          <Card key={subscription.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{subscription.name}</h3>
                <p className="text-2xl text-blue-500">${subscription.price}/month</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="secondary" 
                  size="small"
                  onClick={() => handleEditSubscription(subscription.id)}
                >
                  <FaEdit />
                </Button>
                <Button 
                  variant="danger" 
                  size="small"
                  onClick={() => handleDeleteSubscription(subscription.id)}
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
            <ul className="space-y-2">
              {subscription.features.map((feature, index) => (
                <li key={index} className="text-gray-300 flex items-center">
                  <span className="mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionManagement;