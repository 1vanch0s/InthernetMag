import React from "react";
import { Link } from "react-router-dom";

function Cart({ cartItems, removeFromCart, setCartItems }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateQuantity = (productId, quantity) => {
    const updatedCart = cartItems.map(item =>
      item.product_id === productId ? { ...item, quantity: Math.max(1, parseInt(quantity)) } : item
    );
    setCartItems(updatedCart);
  };

  return (
    <div className="cart">
      <h2>Корзина</h2>
      {cartItems.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.product_id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <img
                  src={item.image_url || 'https://via.placeholder.com/150'}
                  alt={item.name}
                  style={{ width: '100px', marginRight: '20px' }}
                />
                <div>
                  <h4>{item.name}</h4>
                  <p>Цена: {item.price.toFixed(2)} руб.</p>
                  <p>
                    Количество:
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product_id, e.target.value)}
                      style={{ width: '50px', margin: '0 10px' }}
                      min="1"
                    />
                  </p>
                  <button onClick={() => removeFromCart(item.product_id)}>Удалить</button>
                </div>
              </li>
            ))}
          </ul>
          <p><strong>Итого: {total.toFixed(2)} руб.</strong></p>
          <Link to="/checkout">
            <button>Оформить заказ</button>
          </Link>
        </>
      )}
    </div>
  );
}

export default Cart;