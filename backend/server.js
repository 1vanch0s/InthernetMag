const express = require('express');
const cors = require('cors'); // Подключаем cors
const productRoutes = require('./routes/products'); // Подключаем роуты

const app = express();


// Middleware для установки правильной кодировки UTF-8
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=UTF-8');
  next();
});

// Разрешаем все запросы с любого домена
app.use(cors());

// Прочие middlewares
app.use(express.json());

// Пример маршрута с продуктами
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
