const express = require('express');
const { query } = require('../db');
const router = express.Router();

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