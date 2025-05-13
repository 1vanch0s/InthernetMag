import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import CartSummary from "./components/CartSummary";
import AdminPanel from "./components/AdminPanel";


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

  const [products, setProducts] = useState([
  { name: "Товар 1", price: "1000", image: "https://via.placeholder.com/150" },
  { name: "Товар 2", price: "1500", image: "https://via.placeholder.com/150" }
  ]);

    useEffect(() => {
  localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
  const storedProducts = localStorage.getItem("products");
  if (storedProducts) {
    setProducts(JSON.parse(storedProducts));
  }
  }, []);
  
  


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
          <Route path="/admin" element={<AdminPanel products={products} setProducts={setProducts} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
