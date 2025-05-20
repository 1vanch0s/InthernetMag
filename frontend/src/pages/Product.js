import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from '../components/ReviewForm';
import Reviews from '../components/Reviews';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product with ID:', id);
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        console.log('Product data:', data);
        // Преобразуем price в число, если он строка
        if (data && typeof data.price === 'string') {
          data.price = parseFloat(data.price);
        }
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.error || 'Failed to load product');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!product) return <p>No product found</p>;

  return (
    <div>
      <h2>{product.name || 'No name'}</h2>
      <p>
        Price: $
        {typeof product.price === 'number' && !isNaN(product.price)
          ? product.price.toFixed(2)
          : 'N/A'}
      </p>
      <img
        src={product.image_url || 'https://via.placeholder.com/200'}
        alt={product.name || 'Product'}
        style={{ maxWidth: '200px' }}
      />
      <p>{product.description || 'No description available'}</p>
      <button
        onClick={() => {
          const cart = JSON.parse(localStorage.getItem('cart')) || [];
          cart.push({
            product_id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
          });
          localStorage.setItem('cart', JSON.stringify(cart));
          alert('Added to cart');
        }}
      >
        Add to Cart
      </button>
      <ReviewForm productId={id} />
      <Reviews productId={id} />
    </div>
  );
};

export default Product;