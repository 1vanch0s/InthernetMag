import React from "react";
import { Link } from "react-router-dom";

function CartSummary({ cartItems }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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