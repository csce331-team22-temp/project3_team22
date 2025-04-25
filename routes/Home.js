const db = require('../database');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    const loginMessage = req.query.loginMessage || "";
    res.render('home', { loginMessage }); 
})

router.get('/menu-board', async (req, res) => {
    try {
      
        res.render('menu-board', { title: 'Menu Board' });

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;