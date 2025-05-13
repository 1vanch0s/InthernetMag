// src/components/CartSummary.js
import React from "react";
import { Link } from "react-router-dom";

function CartSummary({ cartItems }) {
  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const count = cartItems.length;

  return (
    <div style={{ marginBottom: "1rem" }}>
      <Link to="/cart" style={{
        display: "inline-block",
        padding: "0.5rem 1rem",
        backgroundColor: "#007bff",
        color: "#fff",
        textDecoration: "none",
        borderRadius: "4px"
      }}>
        🛒 Перейти в корзину ({count} шт.) — {total.toFixed(2)} руб.
      </Link>
    </div>
  );
}

export default CartSummary;
