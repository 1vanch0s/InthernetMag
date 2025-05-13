import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Каталог товаров</h1>
      <ul>
        {products.map(prod => (
          <li key={prod.id}>
            <strong>{prod.name}</strong> — {prod.price} руб.
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
