import React, { useState, useEffect } from "react";
import "./ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category);
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

    const response = await fetch(`http://localhost:5000/api/products?${params.toString()}`);
    const data = await response.json();
    setProducts(data);
  };
  const fetchCategories = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/categories");
    const data = await res.json();
    setCategories(data);
  } catch (err) {
    console.error("Ошибка при загрузке категорий:", err);
  }
};



  const handleApplyFilters = () => {
    fetchProducts({ category, sort, minPrice, maxPrice });
  };

  return (
    <div>
      <h2>Каталог товаров</h2>

      {/* Фильтры */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
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

        <input type="number" placeholder="Мин. цена" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input type="number" placeholder="Макс. цена" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />

        <button onClick={handleApplyFilters}>Применить</button>
      </div>

      {/* Список товаров */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: "1px solid #ccc", padding: "1rem", width: "200px" }}>
            <img src={product.image_url} alt={product.name} style={{ width: "100%" }} />
            <h4>{product.name}</h4>
            <p>{product.price} ₽</p>
            <p>{product.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
