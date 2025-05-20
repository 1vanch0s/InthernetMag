const express = require('express');
const { query } = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.post('/:productId', authenticate, async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.userId;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    const result = await query(
      'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [productId, userId, rating, comment || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

router.get('/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await query(
      'SELECT r.id, r.rating, r.comment, r.created_at, u.name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = $1 ORDER BY r.created_at DESC',
      [productId]
    );
    const avgRating = await query(
      'SELECT AVG(rating) as average FROM reviews WHERE product_id = $1',
      [productId]
    );
    res.json({
      reviews: reviews.rows,
      averageRating: parseFloat(avgRating.rows[0].average) || 0,
    });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;