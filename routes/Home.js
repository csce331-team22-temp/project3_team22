const db = require('../database');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const loginMessage = req.query.loginMessage || "";
  res.render('home', { loginMessage });
});

router.get('/menu-board', async (req, res) => {
  try {
 
    const result = await db.query(`
      SELECT drinkid, drinkname, category, price, image_url, calories, allergens, ingredients, macros
      FROM menu
      ORDER BY category, drinkname;
    `);


    const categories = {};
    result.rows.forEach(drink => {
      if (!categories[drink.category]) categories[drink.category] = [];
      categories[drink.category].push(drink);
    });


    res.render('menu-board', {
      title: 'Menu Board',
      categories
    });
  } catch (error) {
    console.error('Database query failed:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
