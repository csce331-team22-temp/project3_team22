const db = require('../database');
const express = require('express');

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Export functions for usage in other files. Use the require function to gain access to these objects.
// OTO ADDED: Needed so I can talk to you and you can talk to me

const {modifyPearls, resetCustomer, getCustomerID} = require('./SharedVariables');



////////////////////////////////////////////////////////////////////////////////////////////////////////

const router = express.Router();
var orderItems = [];
var customerID = 0;

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
        if (price == 0) modifyPearls(10, customerID);
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

    // check if email is in database and store staffid if so
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

    // check if customer is logged in and save customerid if so
    if(getCustomerID() != null){
        customerID = getCustomerID();
    }

    // add payment method to order data depending on button pressed
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

        // loop through items of order data, add items to orders table and ordertoppings table, subtract items used from inventory
        for (const item of orderData) {
            const drinkidQuery = `SELECT drinkid FROM menu WHERE drinkname = $1`;
            const resultTwo = await db.query(drinkidQuery, [item.itemName]);
            const drinkid = resultTwo.rows[0].drinkid;
            console.log("drinkid:", resultTwo.rows[0].drinkid);

            const currentTime = new Date();
            const formattedTime = currentTime.toISOString().slice(0, 19).replace('T', ' ');

            // query to insert order into orders table
            const orderQuery = `INSERT INTO orders (customerid, staffid, drinkid, orderid, amountpaid, dateordered, paymentmethod) VALUES ($1, $2, $3, $4, $5, $6, $7);`;
            const values = [customerID, staffID, drinkid, orderid, item.itemPrice, formattedTime, item.paymentMethod];
            await db.query(orderQuery, values);
            console.log("Inserted order");

            // queries to update order toppings table and subtract toppings used from inventory
            for (const topping of item.itemToppings) {
                const toppingsQuery = `INSERT INTO ordertoppings ( orderid, topping, drinkid) VALUES ($1, $2, $3)`;
                await db.query(toppingsQuery, [orderid, topping, drinkid]);

                const inventoryQueryOne = `UPDATE inventory SET quantity = quantity - 1 WHERE itemname = $1`;
                await db.query(inventoryQueryOne, [topping]);
            }
            console.log("Inserted order toppings");

            // query to subtract ingredients used from inventory (but not toppings b/c they're handled earlier)
            const inventoryQueryTwo = `UPDATE inventory SET quantity = quantity - 1 WHERE itemid IN (SELECT itemid FROM recipes WHERE drinkid = $1)`;
            await db.query(inventoryQueryTwo, [drinkid]);
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
