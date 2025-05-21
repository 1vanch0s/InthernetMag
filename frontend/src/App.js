import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import CartSummary from "./components/CartSummary";
import AdminPanel from "./components/AdminPanel";
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';
import Product from './pages/Product';

function App() {
  const [cartItems, setCartItems] = useState([]);

  // Загрузка корзины из localStorage при монтировании
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Синхронизация cartItems с localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find(item => item.product_id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
          quantity: 1,
          image_url: product.image_url || product.image || 'https://via.placeholder.com/150',
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter(item => item.product_id !== productId));
  };

  return (
    <Router>
      <div style={{ padding: "2rem" }}>
        <h1>Интернет-магазин</h1>
        <Navbar />
        <CartSummary cartItems={cartItems} />
        
        <Routes>
          <Route path="/" element={<ProductList addToCart={addToCart} />} />
          <Route path="/products/:id" element={<Product addToCart={addToCart} />} />
          <Route 
            path="/cart" 
            element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} setCartItems={setCartItems} />} 
          />
          <Route 
            path="/checkout" 
            element={<Checkout cartItems={cartItems} setCartItems={setCartItems} />} 
          />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />  
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;