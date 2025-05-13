import React from "react";

function Cart({ cartItems, removeFromCart }) {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h2>Корзина</h2>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            {item.name} — {item.price} руб.
            <button onClick={() => removeFromCart(index)}>Удалить</button>
          </li>
        ))}
      </ul>
      <h4>Итого: {total} руб.</h4>
    </div>
  );
}

export default Cart;

