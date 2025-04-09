const db = require('../database');
const express = require('express');

const router = express.Router();

// add routes here
// Route to render the customer page
let orderItems = [];
router.get('/', (req, res) => {
    res.render('customers', { orderItems });
});

// Route to add items to the order list
router.post('/add-item', (req, res) => {
    const { name, price } = req.body;
    console.log('Item received:', name, price);
    orderItems.push({ name, price });
    res.json({ success: true, message: 'Item added to the cart!' });
});

// Route to remove item from the list
router.post('/remove-item', (req, res) => {
    let { name, price } = req.body;
    price = parseFloat(price);
    console.log('Attempting to remove:', req.body);
    const spliceIndex = orderItems.findIndex(item => item.name === name && item.price === price);
    if (spliceIndex != -1){
        orderItems.splice(spliceIndex, 1);
        res.json({ success: true, message: 'Item removed from the cart!' });
    }
    else {
        res.json({ success: false, message: 'Item not found in the cart :(' });
    }
});

// Route for proceeding to checkout and passing orderItems to checkout.ejs
router.get('/checkout', (req, res) => {
    res.render('checkout', { orderItems });
});

// database queries for checkout
router.post('/checkout/payment', async (req, res) => {
    // Retrieve the paymentMethod sent from the fetch request
    const { paymentMethod } = req.body;

    const orderData = orderItems.map(item => ({
        itemName: item.name,
        itemPrice: item.price,
        paymentMethod: paymentMethod
    }));

    try{
        const orderidQuery = `SELECT MAX(orderid) FROM kioskorders`;
        const resultOne = await db.query(orderidQuery);
        const orderid = resultOne.rows[0].max + 1;

        for (const item of orderData) {
            const drinkidQuery = `SELECT drinkid FROM menu WHERE drinkname = $1`;
            const resultTwo = await db.query(drinkidQuery, [item.itemName]);
            const drinkid = resultTwo.rows[0].drinkid;
            console.log("drinkid:", resultTwo.rows[0].drinkid);

            const currentTime = new Date();
            const formattedTime = currentTime.toISOString().slice(0, 19).replace('T', ' ');

            const orderQuery = `INSERT INTO kioskorders (orderid, drinkid, amountpaid, dateordered, paymentmethod) VALUES ($1, $2, $3, $4, $5);`;
            const values = [orderid, drinkid, item.itemPrice, formattedTime, item.paymentMethod];

            const resultThree = await db.query(orderQuery, values);
            console.log("Inserted order");

            const inventoryQuery = `UPDATE inventory SET quantity = quantity - 1 WHERE itemid IN (SELECT itemid FROM recipes WHERE drinkid = $1)`;
            const resultFour = await db.query(inventoryQuery, [drinkid]);
            console.log("Subtracted ingredients of drinkid:", drinkid);
        }

        orderItems = [];
        res.json({ success: true, message: "Order successfully inserted into the database!" });

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;