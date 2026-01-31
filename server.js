const express = require('express');
const path = require('path');
const pool = require('./db'); // твое подключение к PostgreSQL

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Маршрут API для меню
app.get('/api/menu', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menu');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут API для отзывов
app.get('/api/reviews', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reviews ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/reviews', async (req, res) => {
  const { name, review } = req.body;
  try {
    await pool.query('INSERT INTO reviews(name, review) VALUES($1,$2)', [name, review]);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для заказов
app.post('/api/orders', async (req, res) => {
  const { customer_id, items } = req.body;
  try {
    let total = 0;
    for (const i of items) {
      await pool.query(
        'INSERT INTO orders(customer_id, item_id, quantity, price) VALUES($1,$2,$3,$4)',
        [customer_id, i.id, i.quantity, i.price]
      );
      total += i.price * i.quantity;
    }
    res.json({ total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





