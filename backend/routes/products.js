const express = require('express');
const { query } = require('../db');
const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Received token:', token); // Лог токена
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Лог декодированного токена
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message); // Лог ошибки
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Новый маршрут для рекомендаций
router.get('/recommendations', authenticate, async (req, res) => {
  const userId = req.userId;
  try {
    // Найти категории из заказов пользователя
    const categoriesResult = await query(
      `SELECT DISTINCT p.category
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = $1`,
      [userId]
    );
    const categories = categoriesResult.rows.map(row => row.category);

    if (categories.length === 0) {
      // Если нет заказов, вернуть популярные товары
      const popularProducts = await query(
        'SELECT * FROM products ORDER BY created_at DESC LIMIT 4'
      );
      return res.json(popularProducts.rows.map(p => ({
        ...p,
        price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
      })));
    }

    // Получить товары из категорий
    const placeholders = categories.map((_, i) => `$${i + 1}`).join(',');
    const productsResult = await query(
      `SELECT * FROM products 
       WHERE category IN (${placeholders})
       ORDER BY RANDOM() 
       LIMIT 4`,
      categories
    );

    res.json(productsResult.rows.map(p => ({
      ...p,
      price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
    })));
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

router.get('/', async (req, res) => {
  const { category, sort, minPrice, maxPrice } = req.query;

  //console.log('Полученные параметры:', { category, sort, minPrice, maxPrice });

  let queryText = 'SELECT * FROM products WHERE 1=1';
  const values = [];
  let count = 1;

  if (category) {
    queryText += ` AND category = $${count++}`;
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

  if (sort === 'price_asc') {
    queryText += ' ORDER BY price ASC';
  } else if (sort === 'price_desc') {
    queryText += ' ORDER BY price DESC';
  } else if (sort === 'newest') {
    queryText += ' ORDER BY created_at DESC';
  }

  try {
    const result = await query(queryText, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка в /api/products:', err.message);
    res.status(500).json({ message: 'Ошибка при получении товаров' });
  }
});

router.post('/', async (req, res) => {
  const { name, price, image_url, description, category, in_stock } = req.body;

  if (!name || !price || !image_url) {
    return res.status(400).json({ message: 'Имя, цена и изображение обязательны' });
  }

  try {
    const result = await query(
      'INSERT INTO products (name, price, image_url, description, category, in_stock, created_at) VALUES ($1, $2, $3, $4, $5, $6, now()) RETURNING *',
      [name, price, image_url, description || '', category || '', in_stock || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при добавлении товара: ', err);
    res.status(500).json({ message: 'Ошибка при добавлении товара' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});



module.exports = router;