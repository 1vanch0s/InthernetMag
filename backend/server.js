const express = require('express');
const cors = require('cors'); // Подключаем cors
const productRoutes = require('./routes/products'); // Подключаем роуты
const { query } = require('./db'); // Импортируем pool из db.js для работы с БД

const app = express();
const categoryRoutes = require('./routes/categories');



// Middleware для установки правильной кодировки UTF-8
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=UTF-8');
  next();
});

// Разрешаем все запросы с любого домена
app.use(cors());

// Прочие middlewares
app.use(express.json());

app.get("/api/products", async (req, res) => {
  const { category, sort, minPrice, maxPrice } = req.query;

  console.log("Полученные параметры:", { category, sort, minPrice, maxPrice });

  let queryText = 'SELECT * FROM products WHERE 1=1';
  const values = [];    
  let count = 1;


  if (category) {
    queryText += ' AND category = $1';
    values.push(category);
  }
  if (minPrice) {
    queryText += ` AND price >= $${count++}`;
    values.push(Number(minPrice));
  }

  if (maxPrice) {
    queryText += ` AND price <= $${count++}`;
    values.push(Number(maxPrice));
  }

  // Сортировка
  if (sort === "price_asc") {
    queryText += " ORDER BY price ASC";
  } else if (sort === "price_desc") {
    queryText += " ORDER BY price DESC";
  } else if (sort === "newest") {
    queryText += " ORDER BY created_at DESC";
  }

  try {
    const result = await query(queryText, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Ошибка в /api/products:", err.message);
    console.error("Ошибка при получении товаров:", err);
    res.status(500).json({ message: "Ошибка при получении товаров" });
  }
});


app.post("/api/products", async (req, res) => {
  const { name, price, image_url, description, category, in_stock } = req.body;

  if (!name || !price || !image_url ) {
    return res.status(400).json({ message: "Имя, цена и изображение обязательны" });
  }

  try {
    // Добавляем новый товар в БД
    const result = await query(
      'INSERT INTO products (name, price, image_url, description, category, in_stock, created_at) VALUES ($1, $2, $3, $4, $5, $6, now()) RETURNING *',
      [name, price, image_url, description || '', category || '', in_stock || 0]
    );
    const newProduct = result.rows[0]; // Получаем добавленный товар
    res.status(201).json(result.rows[0]); // Отправляем добавленный товар в ответе
  } catch (err) {
    console.error('Ошибка при добавлении товара: ', err);
    res.status(500).json({ message: 'Ошибка при добавлении товара' });
  }
});

// Пример маршрута с продуктами
app.use("/api/products", productRoutes);

// app.get("/api/products", (req, res) => {
//   res.json(products);
// });
app.use("/api/categories", categoryRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
