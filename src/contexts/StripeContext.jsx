import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';

const StripeContext = createContext();

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};

export const StripeProvider = ({ children }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [stripeConfig, setStripeConfig] = useState({
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    products: {
      basic: {
        id: 'prod_basic',
        priceId: 'price_basic_monthly',
        name: 'Plan Básico',
        prices: {
          monthly: 30,
          yearly: 300
        }
      },
      pro: {
        id: 'prod_pro',
        priceId: 'price_pro_monthly',
        name: 'Pro 10',
        prices: {
          monthly: 50,
          yearly: 500
        }
      },
      proUltra: {
        id: 'prod_ultra',
        priceId: 'price_ultra_monthly',
        name: 'Pro Ultra',
        prices: {
          monthly: 100,
          yearly: 1000
        }
      }
    }
  });

  useEffect(() => {
    loadStripeConfiguration();
  }, []);

  const loadStripeConfiguration = async () => {
    try {
      const isDev = import.meta.env.DEV;
      
      if (isDev) {
        if (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
          const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
          setStripePromise(stripe);
          setStripeEnabled(true);
        }
        return;
      }

      const response = await fetch('/api/stripe/config', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to load Stripe configuration');
      }

      const config = await response.json();
      setStripeConfig(config);

      if (config.publishableKey) {
        const stripe = await loadStripe(config.publishableKey);
        setStripePromise(stripe);
        setStripeEnabled(true);
      }
    } catch (error) {
      console.error('Error loading Stripe config:', error);
      if (!import.meta.env.DEV) {
        toast.error('Error al cargar la configuración de Stripe');
      }
    }
  };

  const updateStripeConfig = async (newConfig) => {
    try {
      if (import.meta.env.DEV) {
        setStripeConfig(newConfig);
        return;
      }

      const response = await fetch('/api/stripe/config', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newConfig)
      });

      if (!response.ok) {
        throw new Error('Failed to update Stripe configuration');
      }

      const updatedConfig = await response.json();
      setStripeConfig(updatedConfig);
      toast.success('Configuración de Stripe actualizada');
    } catch (error) {
      toast.error('Error al actualizar la configuración de Stripe');
      throw error;
    }
  };

  return (
    <StripeContext.Provider value={{
      stripeEnabled,
      stripeConfig,
      updateStripeConfig,
      loadStripeConfiguration
    }}>
      {stripeEnabled && stripePromise ? (
        <Elements stripe={stripePromise}>
          {children}
        </Elements>
      ) : (
        children
      )}
    </StripeContext.Provider>
  );
};