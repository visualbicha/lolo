import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const StripeSettings = () => {
  const [stripeConfig, setStripeConfig] = useState({
    publishableKey: '',
    secretKey: '',
    webhookSecret: '',
    basicPlanId: '',
    proPlanId: '',
    enterprisePlanId: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStripeConfig();
  }, []);

  const loadStripeConfig = async () => {
    try {
      // En un entorno real, esto cargaría la configuración desde el backend
      setStripeConfig({
        publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
        secretKey: '',
        webhookSecret: '',
        basicPlanId: 'price_basic',
        proPlanId: 'price_pro',
        enterprisePlanId: 'price_enterprise'
      });
    } catch (error) {
      console.error('Error loading Stripe config:', error);
      toast.error('Error al cargar la configuración de Stripe');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStripeConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Aquí iría la lógica para guardar la configuración en el backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      toast.success('Configuración de Stripe actualizada correctamente');
    } catch (error) {
      console.error('Error saving Stripe config:', error);
      toast.error('Error al guardar la configuración de Stripe');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-400">Cargando configuración...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Configuración de Stripe</h2>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              id="publishableKey"
              label="Clave Publicable"
              name="publishableKey"
              value={stripeConfig.publishableKey}
              onChange={handleChange}
              placeholder="pk_test_..."
              required
            />

            <Input
              id="secretKey"
              label="Clave Secreta"
              name="secretKey"
              value={stripeConfig.secretKey}
              onChange={handleChange}
              placeholder="sk_test_..."
              type="password"
              required
            />
          </div>

          <Input
            id="webhookSecret"
            label="Secreto del Webhook"
            name="webhookSecret"
            value={stripeConfig.webhookSecret}
            onChange={handleChange}
            placeholder="whsec_..."
            type="password"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              id="basicPlanId"
              label="ID Plan Básico"
              name="basicPlanId"
              value={stripeConfig.basicPlanId}
              onChange={handleChange}
              placeholder="price_..."
              required
            />

            <Input
              id="proPlanId"
              label="ID Plan Pro"
              name="proPlanId"
              value={stripeConfig.proPlanId}
              onChange={handleChange}
              placeholder="price_..."
              required
            />

            <Input
              id="enterprisePlanId"
              label="ID Plan Enterprise"
              name="enterprisePlanId"
              value={stripeConfig.enterprisePlanId}
              onChange={handleChange}
              placeholder="price_..."
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Configuración'}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold text-white mb-4">Webhooks</h3>
        <p className="text-gray-400 mb-4">
          Configura los siguientes eventos en tu dashboard de Stripe:
        </p>
        <ul className="list-disc list-inside text-gray-400 space-y-2">
          <li>customer.subscription.created</li>
          <li>customer.subscription.updated</li>
          <li>customer.subscription.deleted</li>
          <li>invoice.paid</li>
          <li>invoice.payment_failed</li>
        </ul>
      </Card>
    </div>
  );
};

export default StripeSettings;