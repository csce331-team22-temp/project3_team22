const db = require('../database');
const express = require('express');
const router = express.Router();

// Route to display menu categories
router.get('/', async (req, res) => {
    try {
        const result = await db.query("SELECT DISTINCT category FROM menu");
        const categories = result.rows.map(row => row.category);
        res.render("menu", { categories });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching menu categories");
    }
});

// Route to display drinks in a category
router.get('/:category', async (req, res) => {
    try {
        const category = req.params.category;

        const drinkQuery = await db.query("SELECT * FROM menu WHERE category = $1", [category]);
        if (drinkQuery.rows.length === 0) {
            return res.status(404).send("Category not found");
        }

        const toppingsQuery = await db.query("SELECT unnest(string_to_array(toppings, ',')) AS topping FROM toppings;");
        const toppings = toppingsQuery.rows.map(row => row.topping);

        res.render("drinks", {
            category,
            drinks: drinkQuery.rows,
            toppings
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching drinks");
    }
});

module.exports = router;
