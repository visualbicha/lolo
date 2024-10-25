import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// Obtener configuración de Stripe
app.get('/api/stripe/config', async (req, res) => {
  try {
    res.json({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar configuración de Stripe
app.post('/api/stripe/config', async (req, res) => {
  try {
    // En un entorno real, aquí actualizarías las variables de entorno
    // o la configuración en tu base de datos
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener productos de Stripe
app.get('/api/stripe/products', async (req, res) => {
  try {
    const products = await stripe.products.list({
      expand: ['data.default_price']
    });

    const formattedProducts = products.data.map(product => ({
      id: product.id,
      name: product.name,
      prices: {
        monthly: {
          id: product.default_price?.id,
          amount: product.default_price?.unit_amount / 100
        }
      }
    }));

    res.json({ products: formattedProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear nuevo producto en Stripe
app.post('/api/stripe/products', async (req, res) => {
  try {
    const { name, prices } = req.body;

    // Crear producto
    const product = await stripe.products.create({
      name,
      type: 'service'
    });

    // Crear precios
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: prices.monthly.amount * 100,
      currency: 'eur',
      recurring: {
        interval: 'month'
      }
    });

    const yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: prices.yearly.amount * 100,
      currency: 'eur',
      recurring: {
        interval: 'year'
      }
    });

    res.json({
      product: {
        id: product.id,
        name: product.name,
        prices: {
          monthly: {
            id: monthlyPrice.id,
            amount: monthlyPrice.unit_amount / 100
          },
          yearly: {
            id: yearlyPrice.id,
            amount: yearlyPrice.unit_amount / 100
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar producto en Stripe
app.patch('/api/stripe/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await stripe.products.update(id, updates);

    if (updates.prices) {
      // Actualizar precios existentes o crear nuevos
      for (const [interval, price] of Object.entries(updates.prices)) {
        if (price.id) {
          await stripe.prices.update(price.id, {
            unit_amount: price.amount * 100
          });
        } else {
          await stripe.prices.create({
            product: id,
            unit_amount: price.amount * 100,
            currency: 'eur',
            recurring: { interval }
          });
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar producto en Stripe
app.delete('/api/stripe/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await stripe.products.del(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sincronizar con Stripe
app.post('/api/stripe/sync', async (req, res) => {
  try {
    // Obtener todos los productos y precios
    const [products, prices] = await Promise.all([
      stripe.products.list(),
      stripe.prices.list()
    ]);

    // Aquí podrías sincronizar con tu base de datos local
    res.json({
      success: true,
      products: products.data,
      prices: prices.data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));