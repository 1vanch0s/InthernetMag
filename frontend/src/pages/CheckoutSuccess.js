import React, { useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      axios.post(`http://localhost:5000/api/checkout/confirm/${orderId}`)
        .then(() => {
          localStorage.removeItem('cart'); // Очищаем корзину
        })
        .catch(err => console.error('Failed to confirm order:', err));
    }
  }, [orderId]);

  return (
    <div>
      <h2>Payment Successful!</h2>
      <p>Your order #{orderId} has been placed.</p>
    </div>
  );
};

export default CheckoutSuccess;