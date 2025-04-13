const db = require('../database');
const express = require('express');

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Export functions for usage in other files. Use the require function to gain access to these objects.
// OTO ADDED: Needed so I can talk to you and you can talk to me

const {modifyPearls, resetCustomer, getCustomerID} = require('./SharedVariables');



////////////////////////////////////////////////////////////////////////////////////////////////////////

const router = express.Router();
var orderItems = [];

router.get('/', (req, res) => {
    res.render('customers', { orderItems });
});

// Route to add items to the order list
router.post('/add-item', (req, res) => {
    const {name, price, sugar = 5, ice = 5, toppings = []} = req.body;
    console.log('Item received:', name, price, sugar, ice, toppings);
    orderItems.push({ name, price, sugar, ice, toppings });
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
        
        // 🟡 OTO ADDED: Done so refunding can happen if person removes a rewards item from the cart
        if (price == 0) modifyPearls(10);
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
    let staffID = 0;

    if(req.user){
        let staffEmail = req.user.emails[0].value;
        const staffidQuery = `SELECT staffid FROM staffmembers WHERE email = $1`;
        const result = await db.query(staffidQuery, [staffEmail]);
        staffID = result.rows[0].staffid;
        console.log("staffID:", staffID);
    }
    else{
        console.log("email machine broke");
    }

    // 🟡 OTO ADDED: Will happen whenever customerID is needed for a purchase
    customerID = getCustomerID();

    const orderData = orderItems.map(item => ({
        itemName: item.name,
        itemPrice: item.price,
        itemSugarLevel: item.sugar,
        itemIceLevel: item.ice,
        itemToppings: item.toppings,
        paymentMethod: paymentMethod
    }));

    try{
        const orderidQuery = `SELECT MAX(orderid) FROM orders`;
        const resultOne = await db.query(orderidQuery);
        const orderid = resultOne.rows[0].max + 1;

        for (const item of orderData) {
            const drinkidQuery = `SELECT drinkid FROM menu WHERE drinkname = $1`;
            const resultTwo = await db.query(drinkidQuery, [item.itemName]);
            const drinkid = resultTwo.rows[0].drinkid;
            console.log("drinkid:", resultTwo.rows[0].drinkid);

            const currentTime = new Date();
            const formattedTime = currentTime.toISOString().slice(0, 19).replace('T', ' ');

            const orderQuery = `INSERT INTO orders (customerid, staffid, drinkid, orderid, amountpaid, dateordered, paymentmethod) VALUES ($1, $2, $3, $4, $5, $6, $7);`;
            const values = [0, staffID, drinkid, orderid, item.itemPrice, formattedTime, item.paymentMethod];

            const resultThree = await db.query(orderQuery, values);
            console.log("Inserted order");

            const inventoryQuery = `UPDATE inventory SET quantity = quantity - 1 WHERE itemid IN (SELECT itemid FROM recipes WHERE drinkid = $1)`;
            const resultFour = await db.query(inventoryQuery, [drinkid]);
            console.log("Subtracted ingredients of drinkid:", drinkid);
        }

        orderItems = [];
        res.json({ success: true, message: "Order successfully inserted into the database!" });
        
        // 🟡 OTO ADDED: Done for adding pearls to the account and reseting the customer variable in my code
        resetCustomer(orderData);


    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
// OTO ADDED: By nature of module.exports, if i dont put this after the previous line the function gets overriden
// The other exports.[...] gets overriden by it too. The only other solution would be to move the cart over to shared variables,
// But to make it easier for Justin to work how he did before gonna just add this here
module.exports.addItem = async function (name, price) { orderItems.push({ name, price }); };
