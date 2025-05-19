const express = require('express');
const Stripe = require('stripe');
const { query } = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.post('/create-checkout-session', authenticate, async (req, res) => {
  const { items } = req.body;
  const userId = req.userId;

  try {
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderResult = await query(
      'INSERT INTO orders (user_id, total_amount, items, status) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, totalAmount, JSON.stringify(items), 'pending']
    );
    const orderId = orderResult.rows[0].id;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `http://localhost:3000/checkout/success?orderId=${orderId}`,
      cancel_url: 'http://localhost:3000/checkout/cancel',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.post('/confirm/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    await query(
      'UPDATE orders SET status = $1 WHERE id = $2',
      ['completed', orderId]
    );
    res.json({ message: 'Order confirmed' });
  } catch (error) {
    console.error('Confirm error:', error);
    res.status(500).json({ error: 'Failed to confirm order' });
  }
});

module.exports = router;