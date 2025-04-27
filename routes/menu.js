const { isEmployeeLoggedIn } = require('../authMiddleware');
const db = require('../database');
const express = require('express');
const router = express.Router();

// Route to display menu categories + featured drinks
router.get('/', async (req, res) => {
    try {
        // Fetch categories
        const result = await db.query("SELECT DISTINCT category FROM menu");
        const categories = result.rows.map(row => row.category);

        // Fetch featured drinks
        const featuredResult = await db.query("SELECT * FROM menu ORDER BY RANDOM() LIMIT 20");
        const featuredDrinks = featuredResult.rows;

        // Render both
        res.render("menu", { 
            user: req.user, 
            isLoggedIn: !!req.user, 
            isManager: req.user?.position === 'Manager', 
            categories,
            featuredDrinks
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching menu categories");
    }
});

// Route to display drinks by category
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

// Route to show drink info
router.get('/info/:drinkid', async (req, res) => {
    try {
        const drinkid = req.params.drinkid;
        const result = await db.query("SELECT * FROM menu WHERE drinkid = $1", [drinkid]);

        if (result.rows.length === 0) {
            return res.status(404).send("Drink not found");
        }

        const drink = result.rows[0];
        res.render("drink-info", { drink });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading drink info");
    }
});

module.exports = router;
