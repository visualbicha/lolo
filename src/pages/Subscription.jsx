import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaCheck, FaCrown, FaRocket, FaStar, FaInfoCircle } from 'react-icons/fa';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Subscription = () => {
  const { isAuthenticated, hasSubscription } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const plans = [
    {
      id: 'basic',
      name: 'Plan Básico',
      prices: {
        monthly: 30,
        yearly: 300
      },
      icon: FaStar,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Acceso Completo a Todos los Videos',
        'Descargas Ilimitadas',
        'Uso Personal',
        'Sin Marca de Agua',
        'Actualizaciones Mensuales'
      ]
    },
    {
      id: 'pro',
      name: 'Pro 10',
      prices: {
        monthly: 50,
        yearly: 500
      },
      icon: FaCrown,
      color: 'from-purple-500 to-purple-600',
      popular: true,
      features: [
        'Todo lo del Plan Básico',
        '10 Videos Personalizados/mes',
        'Licencia Comercial',
        'Alta Calidad Garantizada',
        'Soporte Prioritario'
      ]
    },
    {
      id: 'enterprise',
      name: 'Pro Ultra',
      price: null,
      icon: FaRocket,
      color: 'from-green-500 to-green-600',
      features: [
        'Todo lo del Plan Pro',
        'Videos Personalizados Ilimitados',
        'Licencia Comercial Extendida',
        'Soporte Dedicado 24/7',
        'Prioridad Máxima',
        'White-label option'
      ]
    }
  ];

  const handleSubscribe = (planId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/subscription', plan: planId } });
      return;
    }
    navigate(`/subscription/checkout/${planId}?cycle=${billingCycle}`);
  };

  const getAnnualSavings = (monthlyPrice) => {
    const yearlyPrice = monthlyPrice * 12;
    const yearlyWithDiscount = monthlyPrice * 10; // 2 months free
    return yearlyPrice - yearlyWithDiscount;
  };

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Planes de Membresía
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Accede a videos de alta calidad generados con IA para tus proyectos.
            Cancela cuando quieras.
          </p>

          <div className="inline-flex items-center justify-center bg-gray-800 p-2 rounded-lg shadow-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                billingCycle === 'monthly' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-400 hover:text-white'
              }`}
              aria-pressed={billingCycle === 'monthly'}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                billingCycle === 'yearly' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-400 hover:text-white'
              }`}
              aria-pressed={billingCycle === 'yearly'}
            >
              Anual
              <span className="text-xs font-medium px-2 py-1 bg-green-500 text-white rounded-full">
                2 meses gratis
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative transform transition-all duration-300 hover:-translate-y-2 ${
                selectedPlanId === plan.id ? 'ring-2 ring-blue-500 scale-105' : ''
              } ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
              onClick={() => setSelectedPlanId(plan.id)}
              tabIndex={0}
              role="button"
              aria-pressed={selectedPlanId === plan.id}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedPlanId(plan.id);
                }
              }}
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
              <div className="mb-6">
                {plan.prices ? (
                  <>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-white">
                        €{plan.prices[billingCycle]}
                      </span>
                      <span className="text-gray-400 ml-2">
                        /{billingCycle === 'monthly' ? 'mes' : 'año'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <div className="mt-2 text-green-400 text-sm flex items-center justify-center gap-1">
                        <FaInfoCircle />
                        <span>Ahorras €{getAnnualSavings(plan.prices.monthly)}/año</span>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-2xl font-bold text-white">Contactar</span>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm font-semibold text-gray-400 mb-2">Incluye:</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-gray-300">
                        <FaCheck className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button
                onClick={() => handleSubscribe(plan.id)}
                className="w-full transform transition-transform duration-200 hover:scale-105"
                variant={plan.popular ? 'primary' : 'secondary'}
                aria-label={`Seleccionar plan ${plan.name}`}
              >
                {hasSubscription ? 'Cambiar Plan' : plan.prices ? 'Comenzar' : 'Contactar'}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Preguntas Frecuentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <h3 className="text-xl font-semibold text-white mb-2">
                ¿Puedo cancelar mi suscripción?
              </h3>
              <p className="text-gray-400">
                Sí, puedes cancelar tu suscripción en cualquier momento. Mantendrás el acceso hasta el final del período facturado.
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-semibold text-white mb-2">
                ¿Qué métodos de pago aceptan?
              </h3>
              <p className="text-gray-400">
                Aceptamos todas las tarjetas principales (Visa, Mastercard, American Express) y transferencias bancarias para planes Enterprise.
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-semibold text-white mb-2">
                ¿Hay contratos a largo plazo?
              </h3>
              <p className="text-gray-400">
                No, todos nuestros planes son flexibles sin compromiso de permanencia.
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-semibold text-white mb-2">
                ¿Qué pasa con mis descargas si cancelo?
              </h3>
              <p className="text-gray-400">
                Los videos descargados durante tu suscripción son tuyos para siempre bajo los términos de la licencia.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;