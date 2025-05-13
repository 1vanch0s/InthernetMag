// src/components/ProductList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ProductList.css";

function ProductList({ addToCart }) {
  const [products, setProducts] = useState([]);

  // useEffect(() => {
  //  axios.get("http://localhost:5000/api/products")
  //    .then(res => setProducts(res.data))
  //    .catch(err => console.error(err));
  // }, []);

  useEffect(() => {
  fetch("http://localhost:5000/api/products")
    .then(res => res.json())
    .then(data => {
      console.log('Полученные данные:', data); // Логируем данные
      setProducts(data);
    })
    .catch(err => console.error("Ошибка при загрузке товаров:", err));
}, []);


  return (
    <div className="product-list">
      <div className="product-grid">
        {products.map(prod => (
          <div className="product-card" key={prod.id}>
            <img src={prod.image_url} alt={prod.name} />
            <h3>{prod.name}</h3>
            <p>{prod.description}</p>
            <p><strong>{prod.price} руб.</strong></p>
            <button onClick={() => addToCart(prod)}>Добавить в корзину</button>
          </div>
        ))}
      </div>



    </div>
  );
}

export default ProductList;
