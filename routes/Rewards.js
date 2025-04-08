const db = require('../database');
const express = require('express');
const router = express.Router();

module.exports = {
    currentCustomer : null
};


router.get('/', (req, res) => {
    let currentCustomer = module.exports.currentCustomer;
    if (currentCustomer != null) {
        res.render('rewards', {currentCustomer}); 
    }
    else res.redirect("/customers/login");
})

router.get('/get-drinks', (req, res) => {
    db.query("select drinkname, image_url from menu;")
    .then(drinks => {
        res.json(drinks.rows);
    });
})









module.exports = router;