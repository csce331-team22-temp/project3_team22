const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

// Create database connection
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: { rejectUnauthorized: false }
});

// Route to display menu categories
router.get('/', async (req, res) => {
    try {
        const result = await pool.query("SELECT DISTINCT category FROM menu");
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
        const result = await pool.query("SELECT * FROM menu WHERE category = $1", [category]);

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
