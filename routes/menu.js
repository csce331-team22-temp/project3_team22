const { isEmployeeLoggedIn } = require('../authMiddleware');
const db = require('../database');
const express = require('express');
const router = express.Router();

// Route to display menu categories
router.get('/', isEmployeeLoggedIn, async (req, res) => {
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
router.get('/:category', isEmployeeLoggedIn, async (req, res) => {
    try {
        const category = req.params.category;
        const result = await db.query("SELECT * FROM menu WHERE category = $1", [category]);

        if (result.rows.length === 0) {
            return res.status(404).send("Category not found");
        }

        res.render("drinks", { category, drinks: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching drinks");
    }
});

module.exports = router;
