// frontend/src/components/ProductCard.js
import React from "react";
import "./ProductCard.css"; // создадим стили отдельно

function ProductCard({ product, addToCart }) {
  return (
    <div className="product-card">
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p className="price">₽{product.price}</p>
      <button onClick={() => addToCart(product)}>Добавить в корзину</button>
    </div>
  );
}

export default ProductCard;
