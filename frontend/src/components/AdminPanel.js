import React, { useState } from "react";

function AdminPanel({ products, setProducts }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !image) return alert("Заполните все поля");

    const newProduct = {
      name,
      price,
      image,
    };

    setProducts([...products, newProduct]);
    setName("");
    setPrice("");
    setImage("");

    fetch("http://localhost:5000/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct)
    })
    .then(res => res.json())
    .then(addedProduct => {
    console.log("Товар добавлен:", addedProduct);
    });

  };

  

  return (
    <div>
      <h2>Админ-панель: Добавить товар</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "300px" }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Название" />
        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Цена" type="number" />
        <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="URL изображения" />
        <button type="submit">Добавить товар</button>
      </form>
    </div>
  );
}

export default AdminPanel;
