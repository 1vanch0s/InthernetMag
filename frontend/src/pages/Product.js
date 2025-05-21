import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Product = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        console.log('Product data:', response.data); // Лог для отладки
        setProduct({
          ...response.data,
          price: typeof response.data.price === 'string' ? parseFloat(response.data.price) : response.data.price,
        });
        setLoading(false);
      } catch (err) {
        console.error('Fetch product error:', err);
        setError('Failed to load product');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div>
      <h2>{product.name}</h2>
      <img src={product.image_url || 'https://via.placeholder.com/150'} alt={product.name} />
      <p>Price: {(typeof product.price === 'number' ? product.price : 0).toFixed(2)} руб.</p>
      <p>{product.description || 'No description available'}</p>
      <button onClick={() => {
        console.log('Adding to cart:', product); // Лог для отладки
        addToCart(product);
      }}>
        Add to Cart
      </button>
    </div>
  );
};

export default Product;