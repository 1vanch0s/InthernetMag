import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Замени на твой публичный тестовый ключ Stripe (pk_test_...)
const stripePromise = loadStripe('pk_test_твой_публичный_ключ');

const CheckoutForm = ({ items, userId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Создаём сессию
      const { data } = await axios.post('http://localhost:5000/api/checkout/create-checkout-session', {
        items,
        userId,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      // Перенаправляем в Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId: data.id });
      if (result.error) {
        setError(result.error.message);
      }
    } catch (err) {
      setError('Failed to initiate checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Payment Details</h3>
      <CardElement />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Предполагаю, что корзина хранится в localStorage или через API
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);

    // Проверяем пользователя
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(({ data }) => setUser(data))
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Checkout</h2>
      <p>Total: ${total.toFixed(2)}</p>
      <Elements stripe={stripePromise}>
        <CheckoutForm items={cartItems} userId={user.id} />
      </Elements>
    </div>
  );
};

export default Checkout;