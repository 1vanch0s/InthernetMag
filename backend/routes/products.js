const express = require("express");
const router = express.Router();
const db = require("../db");


router.get("/", (req, res) => {
  res.json(products);
});

router.post("/", (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res.status(400).json({ message: "Все поля обязательны" });
  }

  const newProduct = {
    id: Date.now(),
    name,
    price,
    image,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});


router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products ORDER BY id DESC");
    console.log(result.rows); // ← Вот здесь смотри, как отображается кириллица
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
