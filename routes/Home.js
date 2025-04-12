const db = require('../database');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    const loginMessage = req.query.loginMessage || "";
    res.render('home', { loginMessage }); 
})

module.exports = router;