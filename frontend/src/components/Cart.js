// src/components/Cart.js
import React from "react";
import { Link } from "react-router-dom";

function Cart({ cartItems, removeFromCart, setCartItems }) {
  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const handleCheckout = () => {
    // Очистка корзины после оформления заказа
    setCartItems([]);
    alert("Ваш заказ оформлен!");
  };
  

  return (
    
    <div className="cart">
      <h2>Корзина</h2>
      {cartItems.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.name} — {item.price} руб.
                <button onClick={() => removeFromCart(index)}>Удалить</button>
              </li>
            ))}
          </ul>
          <p><strong>Итого: {total.toFixed(2)} руб.</strong></p>
          <Link to="/checkout">Оформить заказ</Link>
        </>
      )}
    </div>
  );
}



function CartSummary({ cartItems }) {
  const totalAmount = cartItems.reduce((total, item) => total + parseFloat(item.price), 0);

  return (
    <div style={{ marginTop: "1rem" }}>
      <Link to="/cart">
        <button style={{ padding: "0.5rem 1rem" }}>
          Перейти в корзину ({cartItems.length} товаров) - {totalAmount.toFixed(2)} руб.
        </button>
      </Link>
    </div>
  );
}


export default Cart;
