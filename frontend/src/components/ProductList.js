import React, { useState, useEffect } from "react";
import "./ProductList.css";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

function ProductList({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.category) params.append("category", filters.category);
      if (filters.sort) params.append("sort", filters.sort);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

      const response = await fetch(`http://localhost:5000/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // Преобразуем price в число, если строка
      const formattedData = data.map((product) => ({
        ...product,
        price: typeof product.price === "string" ? parseFloat(product.price) : product.price,
      }));
      setProducts(formattedData);
      setLoading(false);
    } catch (err) {
      console.error("Ошибка при загрузке товаров:", err);
      setError("Failed to load products");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Ошибка при загрузке категорий:", err);
      setError("Failed to load categories");
    }
  };

  const handleApplyFilters = () => {
    fetchProducts({ category, sort, minPrice, maxPrice });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Каталог товаров</h2>

      {/* Фильтры */}
      <div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Все категории</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Без сортировки</option>
          <option value="price_asc">Цена: по возрастанию</option>
          <option value="price_desc">Цена: по убыванию</option>
          <option value="newest">Сначала новые</option>
        </select>

        <input
          type="number"
          placeholder="Мин. цена"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Макс. цена"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <button onClick={handleApplyFilters}>Применить</button>
      </div>

      {/* Список товаров */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ProductCard product={product} addToCart={addToCart} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductList;