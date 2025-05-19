import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');
  return (
    <nav style={{ padding: '10px', background: '#f0f0f0' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Домашнаяя страница</Link>
      {/* <Link to="/cart" style={{ marginRight: '10px' }}>Cart</Link> */}
      {token ? (
        <>
          <Link to="/profile" style={{ marginRight: '10px' }}>Профиль</Link>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: '10px' }}>Логин</Link>
          <Link to="/register">Регистрация</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;