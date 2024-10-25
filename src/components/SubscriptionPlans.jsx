import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStripe } from '../contexts/StripeContext';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import { FaCheck, FaStar, FaCrown, FaRocket, FaSpinner } from 'react-icons/fa';
import Button from './ui/Button';
import Card from './ui/Card';
import { toast } from 'react-toastify';

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const { isAuthenticated, setHasSubscription } = useAuth();
  const { stripePromise, stripeEnabled } = useStripe();
  const navigate = useNavigate();

  const plans = [
    { 
      id: 'basic', 
      name: 'Plan Básico', 
      icon: FaStar,
      color: 'from-blue-500 to-blue-600',
      prices: {
        monthly: 30,
        yearly: 300
      },
      features: [
        'Acceso completo a todos los videos',
        'Alta resolución garantizada',
        'Descargas ilimitadas',
        'Uso personal',
        'Soporte básico por email',
        'Sin marca de agua',
        'Actualizaciones mensuales'
      ]
    },
    { 
      id: 'pro10', 
      name: 'Pro 10',
      icon: FaCrown,
      color: 'from-purple-500 to-purple-600',
      popular: true,
      prices: {
        monthly: 50,
        yearly: 500
      },
      features: [
        'Todo lo del plan Basic',
        '10 videos personalizados/mes',
        'Licencia comercial completa',
        'Soporte prioritario 24/7',
        'Videos a demanda',
        'Resolución 4K garantizada',
        'API access incluido',
        'Prioridad en generación'
      ]
    },
    { 
      id: 'proUltra', 
      name: 'Pro Ultra',
      icon: FaRocket,
      color: 'from-green-500 to-green-600',
      custom: true,
      features: [
        'Todo lo del plan Pro 10',
        'Videos personalizados ilimitados',
        'Licencia comercial extendida',
        'Soporte dedicado 24/7',
        'Prioridad máxima',
        'API personalizada',
        'Modelos AI dedicados',
        'Personalización total',
        'Account Manager personal'
      ]
    }
  ];

  const handlePlanSelect = async (plan) => {
    if (plan.custom) {
      window.location.href = 'mailto:sales@ivisionary.com?subject=Consulta Plan Pro Ultra';
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/subscription', plan: plan.id } });
      return;
    }

    setSelectedPlan(plan);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId: plan.id,
          billingCycle,
          priceAmount: plan.prices[billingCycle]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(err.message);
      toast.error('Error al procesar la suscripción. Por favor, inténtalo de nuevo.');
      console.error('Subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      setHasSubscription(true);
      toast.success('¡Suscripción activada con éxito!');
      navigate('/my-account');
    } catch (err) {
      console.error('Error after payment:', err);
      toast.error('Error al activar la suscripción. Por favor, contacta con soporte.');
    }
  };

  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#6366f1',
      colorBackground: '#1f2937',
      colorText: '#ffffff',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '0.5rem',
      spacingUnit: '4px'
    }
  };

  if (!stripeEnabled) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <div className="text-center py-8">
            <h3 className="text-xl font-bold text-white mb-4">Sistema de Pago No Disponible</h3>
            <p className="text-gray-400">
              Por favor, inténtalo más tarde o contacta con soporte en support@ivisionary.com
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Planes de Membresía</h2>
        <p className="text-xl text-gray-400">Elige el plan que mejor se adapte a tus necesidades</p>
        
        <div className="flex justify-center items-center mt-8 space-x-4">
          <span className={`text-lg ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
            Mensual
          </span>
          <button
            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-14 h-8 bg-gray-700 rounded-full p-1 transition-colors duration-300"
            aria-label={`Cambiar a facturación ${billingCycle === 'monthly' ? 'anual' : 'mensual'}`}
          >
            <div
              className={`absolute w-6 h-6 bg-blue-500 rounded-full transition-transform duration-300 ${
                billingCycle === 'yearly' ? 'translate-x-6' : ''
              }`}
            />
          </button>
          <span className={`text-lg ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
            Anual <span className="text-green-500 text-sm">(2 meses gratis)</span>
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${
              selectedPlan?.id === plan.id ? 'ring-2 ring-blue-500' : ''
            } ${plan.popular ? 'ring-2 ring-purple-500' : ''} 
            transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Más Popular
                </span>
              </div>
            )}

            <div className={`inline-block p-3 rounded-lg bg-gradient-to-br ${plan.color} mb-4`}>
              <plan.icon className="w-6 h-6 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            {!plan.custom ? (
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  €{plan.prices[billingCycle]}
                </span>
                <span className="text-gray-400">/{billingCycle === 'monthly' ? 'mes' : 'año'}</span>
                {billingCycle === 'yearly' && (
                  <p className="text-green-500 text-sm mt-1">2 meses gratis</p>
                )}
              </div>
            ) : (
              <div className="mb-6">
                <span className="text-2xl font-bold text-white">Personalizado</span>
                <p className="text-gray-400 text-sm mt-1">Contacta para precio</p>
              </div>
            )}

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start text-gray-300">
                  <FaCheck className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handlePlanSelect(plan)}
              variant={plan.popular ? 'primary' : 'secondary'}
              disabled={loading && selectedPlan?.id === plan.id}
              className="w-full"
            >
              {loading && selectedPlan?.id === plan.id ? (
                <span className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Procesando...
                </span>
              ) : plan.custom ? (
                'Contactar'
              ) : (
                'Seleccionar Plan'
              )}
            </Button>
          </Card>
        ))}
      </div>

      {selectedPlan && clientSecret && stripeEnabled && (
        <Card className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-4">Completa tu Suscripción</h3>
          <Elements 
            stripe={stripePromise} 
            options={{ 
              clientSecret, 
              appearance,
              locale: 'es'
            }}
          >
            <PaymentElement />
            <Button 
              className="mt-4 w-full" 
              disabled={loading}
              onClick={handlePaymentSuccess}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Procesando...
                </span>
              ) : (
                `Suscribirse a ${selectedPlan.name}`
              )}
            </Button>
          </Elements>
        </Card>
      )}

      {error && (
        <div className="text-red-500 text-center mt-4 bg-red-900 border border-red-700 rounded p-4">
          {error}
        </div>
      )}

      <div className="mt-12 max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Preguntas Frecuentes</h3>
        <div className="space-y-4">
          <Card>
            <h4 className="text-lg font-semibold text-white mb-2">¿Puedo cancelar mi suscripción?</h4>
            <p className="text-gray-400">
              Sí, puedes cancelar tu suscripción en cualquier momento desde tu panel de usuario. 
              Seguirás teniendo acceso hasta el final del período facturado.
            </p>
          </Card>
          <Card>
            <h4 className="text-lg font-semibold text-white mb-2">¿Qué métodos de pago aceptan?</h4>
            <p className="text-gray-400">
              Aceptamos todas las tarjetas de crédito principales (Visa, Mastercard, American Express).
              Los pagos son procesados de forma segura a través de Stripe.
            </p>
          </Card>
          <Card>
            <h4 className="text-lg font-semibold text-white mb-2">¿Qué incluye la licencia comercial?</h4>
            <p className="text-gray-400">
              La licencia comercial te permite usar los videos en proyectos comerciales sin límites,
              incluyendo marketing, publicidad, redes sociales y contenido para clientes.
            </p>
          </Card>
          <Card>
            <h4 className="text-lg font-semibold text-white mb-2">¿Cómo funcionan los videos personalizados?</h4>
            <p className="text-gray-400">
              Podrás solicitar videos específicos generados por IA según tus necesidades. Nuestro sistema
              procesará tu solicitud y generará el video según las especificaciones proporcionadas.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;