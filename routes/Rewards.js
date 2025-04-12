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
});

router.post("/reset-customer", (req, res) => { module.exports.currentCustomer = null; });

router.get('/get-drinks', (req, res) => {
    db.query("select drinkname, image_url from menu;")
    .then(drinks => { res.json(drinks.rows); });
});

router.post("/redeem-drinks", (req, res) => {
    drink_orders = req.body['drinks'];
})

router.post("/fuck-this-idk-yet", (req, res) => {
    for (let i = 0; i < 100; ++i) {
        fetch("/customers/add-item", {
            method : 'POST',
            body: {name : 'IDK', price : 'IDK'}
        });
    }
})






module.exports = router;