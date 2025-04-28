const db = require('../database');
const express = require('express');
const router = express.Router();



////////////////////////////////////////////////////////////////////////////////////////////////////////
// Export functions for usage in other files. Use the require function to gain access to these objects.
const {getCurrentCustomer, modifyPearls} = require('./_SharedVariables');
const {addItem} = require('./Customers');

////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/', (req, res) => {
    let currentCustomer =  getCurrentCustomer();
    if (currentCustomer != null) {
        res.render('rewards', {currentCustomer}); 
    }
    else res.redirect("/customers/login");
});



router.get('/get-drinks', (req, res) => {
    db.query("select drinkname, image_url from menu;")
    .then(drinks => { res.json(drinks.rows); });
});

router.post("/redeem-drinks", (req, res) => {
    let drink_orders = req.body['drinks'];
    let currentCustomer =  getCurrentCustomer();

    if (drink_orders.length == 0 ) {
        res.status(400).json("No Items that were redeemed");
        return;
    }
    if (currentCustomer == null) {
        res.status(404).json("Customer not found for completing purchase");
        return;
    }
    else if (drink_orders.length * 10 > currentCustomer.pearls) {
        res.status(400).json("More pearls required for this order");
        return;
    }

    for (let i = 0; i < drink_orders.length; ++i) {
        addItem(drink_orders[i], 0);
        modifyPearls(-10);

    }
    res.status(200).json("Sucessful");
    return;
});



module.exports = router;