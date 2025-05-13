const express = require('express');
const router = express.Router();
const { query } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != \'\'');
    const categories = result.rows.map(row => row.category);
    res.json(categories);
  } catch (err) {
    console.error('Ошибка при получении категорий:', err);
    res.status(500).json({ message: 'Ошибка при получении категорий' });
  }
});

module.exports = router;


