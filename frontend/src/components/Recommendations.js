import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
//const jwt = require('jsonwebtoken');

const Recommendations = ({ addToCart }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const token = localStorage.getItem('token');
      console.log('Token for recommendations:', token); // Лог токена
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get('http://localhost:5000/api/products/recommendations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Request config:', config); // Лог заголовка
        console.log('Recommendations data:', data); // Лог данных
        setRecommendations(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations');
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (loading) return <div>Loading recommendations...</div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (recommendations.length === 0) return <p>No recommendations available</p>;

  return (
    <div>
      <h3>Recommended for You</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {recommendations.map((product) => (
          <div
            key={product.id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              width: '200px',
              textAlign: 'center',
            }}
          >
            <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <img
                src={product.image_url || 'https://via.placeholder.com/150'}
                alt={product.name}
                style={{ maxWidth: '100%' }}
              />
              <h4>{product.name}</h4>
              <p>
                $
                {typeof product.price === 'number' && !isNaN(product.price)
                  ? product.price.toFixed(2)
                  : 'N/A'}
              </p>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;