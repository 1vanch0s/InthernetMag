// src/components/Checkout.js
import React from "react";
import { Link } from "react-router-dom";

function Checkout({ cartItems, setCartItems }) {
  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const handleCheckout = () => {
    // Оформление заказа, можно очистить корзину после оформления
    setCartItems([]);  // Очистка корзины
    alert("Ваш заказ оформлен!");
  };

  return (
    <div className="checkout">
      <h2>Подтверждение заказа</h2>
      {cartItems.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.name} — {item.price} руб.
              </li>
            ))}
          </ul>
          <p><strong>Итого: {total.toFixed(2)} руб.</strong></p>
          <button onClick={handleCheckout} >Подтвердить заказ</button>
          <Link to="/">Вернуться к покупкам</Link>
        </>
      )}
    </div>
  );
}

export default Checkout;
