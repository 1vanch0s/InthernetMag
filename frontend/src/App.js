import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import CartSummary from "./components/CartSummary";


function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
  };

  return (
    <Router>
      <div style={{ padding: "2rem" }}>
        <h1>Интернет-магазин</h1>
        <CartSummary cartItems={cartItems} />
        
        <Routes>
          <Route path="/" element={<ProductList addToCart={addToCart} />} />
          <Route 
            path="/cart" 
            element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} />} 
          />
          <Route 
            path="/checkout" 
            element={<Checkout cartItems={cartItems} setCartItems={setCartItems} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
