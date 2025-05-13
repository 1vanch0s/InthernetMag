import React, { useState } from "react";

function AdminPanel({ products, setProducts }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState(""); // Добавлено описание
  const [category, setCategory] = useState(""); // Добавлена категория
  const [inStock, setInStock] = useState(0); // Добавлено количество на складе

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !image) return alert("Заполните все обязательные поля");

    const newProduct = {
      name,
      price,
      image_url: image, // Переименовано в image_url
      description,
      category,
      in_stock: inStock,
    };

    fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    })
      .then(res => {console.log("ответ от сервера: ", res); return res.json()})
      .then(addedProduct => {
        console.log("Товар добавлен:", addedProduct);
        // Обновляем список товаров после добавления нового
        setProducts([...products, addedProduct]);
        setName("");
        setPrice("");
        setImage("");
        setDescription(""); // Очистка поля
        setCategory(""); // Очистка поля
        setInStock(0); // Очистка поля
      })
      .catch(err => console.error("Ошибка при добавлении товара:", err));
  };

  return (
    <div>
      <h2>Админ-панель: Добавить товар</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "300px" }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Название" />
        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Цена" type="number" />
        <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="URL изображения" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Описание" />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Категория" />
        <input value={inStock} onChange={(e) => setInStock(e.target.value)} placeholder="Количество на складе" type="number" />
        <button type="submit">Добавить товар</button>
      </form>
    </div>
  );
}

export default AdminPanel;
