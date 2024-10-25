import React, { useState, useEffect } from 'react';
import { FaKey, FaEdit, FaEye, FaEyeSlash, FaSave, FaTrash, FaPlus, FaSpinner, FaSync } from 'react-icons/fa';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { toast } from 'react-toastify';

const StripeManagement = () => {
  const [stripeKeys, setStripeKeys] = useState({
    publishable: '',
    secret: '',
    webhook: ''
  });

  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [products, setProducts] = useState([]);

  // Cargar configuración inicial
  useEffect(() => {
    loadStripeConfig();
    loadStripeProducts();
  }, []);

  const loadStripeConfig = async () => {
    try {
      const response = await fetch('/api/stripe/config');
      const data = await response.json();
      setStripeKeys({
        publishable: data.publishableKey || '',
        secret: '••••••••', // No mostrar la clave secreta completa
        webhook: '••••••••' // No mostrar el secreto del webhook completo
      });
    } catch (error) {
      console.error('Error loading Stripe config:', error);
    }
  };

  const loadStripeProducts = async () => {
    try {
      const response = await fetch('/api/stripe/products');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error loading Stripe products:', error);
      toast.error('Error al cargar los productos de Stripe');
    }
  };

  const handleSaveKeys = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stripeKeys)
      });

      if (!response.ok) {
        throw new Error('Error al guardar la configuración');
      }

      toast.success('Configuración de Stripe guardada correctamente');
      setEditing(false);
      await loadStripeConfig(); // Recargar la configuración
    } catch (error) {
      toast.error(error.message || 'Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncWithStripe = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/stripe/sync', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Error al sincronizar con Stripe');
      }

      await loadStripeProducts(); // Recargar productos
      toast.success('Sincronización con Stripe completada');
    } catch (error) {
      toast.error(error.message || 'Error al sincronizar con Stripe');
    } finally {
      setSyncing(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch('/api/stripe/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Nuevo Plan',
          prices: {
            monthly: { amount: 0 },
            yearly: { amount: 0 }
          }
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear el producto');
      }

      await loadStripeProducts(); // Recargar productos
      toast.success('Producto creado correctamente');
    } catch (error) {
      toast.error(error.message || 'Error al crear el producto');
    }
  };

  const handleUpdateProduct = async (productId, field, value) => {
    try {
      const response = await fetch(`/api/stripe/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [field]: value
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el producto');
      }

      await loadStripeProducts(); // Recargar productos
      toast.success('Producto actualizado correctamente');
    } catch (error) {
      toast.error(error.message || 'Error al actualizar el producto');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      const response = await fetch(`/api/stripe/products/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }

      await loadStripeProducts(); // Recargar productos
      toast.success('Producto eliminado correctamente');
    } catch (error) {
      toast.error(error.message || 'Error al eliminar el producto');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Configuración de Stripe</h2>
        <Button
          onClick={handleSyncWithStripe}
          disabled={syncing}
          variant="secondary"
        >
          {syncing ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Sincronizando...
            </>
          ) : (
            <>
              <FaSync className="mr-2" />
              Sincronizar con Stripe
            </>
          )}
        </Button>
      </div>

      {/* Rest of the component remains the same */}
    </div>
  );
};

export default StripeManagement;