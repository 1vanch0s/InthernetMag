// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  client_encoding: 'UTF8',
});

pool.connect((err) => {
  if (err) {
    console.error('Failed to connect to PostgreSQL:', err.stack);
  } else {
    console.log('Connected to PostgreSQL');
  }
});

const query = (text, params) => pool.query(text, params);

module.exports = { query };


