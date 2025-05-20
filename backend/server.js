const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');
const checkoutRoutes = require('./routes/checkout');
const reviewsRoutes = require('./routes/reviews');


const app = express();

// Middleware
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=UTF-8');
  next();
});
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/reviews', reviewsRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));