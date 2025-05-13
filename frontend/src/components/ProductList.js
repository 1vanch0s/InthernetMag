// src/components/ProductList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "./ProductList.css";

  function ProductList({ addToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="product-grid">
      {products.map(prod => (
        <ProductCard
          key={prod.id}
          product={prod}
          addToCart={addToCart}
        />
      ))}
    </div>
  );
}

export default ProductList;
