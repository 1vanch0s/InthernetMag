import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51RQXc9KdbJcScXkvPS7v4ayIF5xIyKm9mRUdQLpnEStNNrTLD68JZZkQIbDXmk7pbm8qtFUeUw1bx4dFArXpidKK00cdIjUwR6');

const CheckoutForm = ({ items }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to proceed with payment');
      navigate('/login');
      return;
    }

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/checkout/create-checkout-session',
        { items },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const result = await stripe.redirectToCheckout({ sessionId: data.id });
      if (result.error) {
        setError(result.error.message);
      }
    } catch (err) {
      setError(err.response?.data.error || 'Failed to initiate checkout');
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

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Checkout</h2>
      <p>Total: ₽{total.toFixed(2)}</p>
      <Elements stripe={stripePromise}>
        <CheckoutForm items={cartItems} />
      </Elements>
    </div>
  );
};

export default Checkout;