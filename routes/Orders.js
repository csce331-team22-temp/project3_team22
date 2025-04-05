const db = require('../database');
const express = require('express');

const router = express.Router();

// add routes here

// redirects page to staff page with staff details
router.get('/recent', async (req, res) => {
    try {
        const query = `SELECT customers.name AS custname, customers.phonenumber AS custphonenum, staffmembers.name AS cashiername, orders.orderid AS ordernum, MAX(orders.dateordered) AS orderdate, SUM(orders.amountpaid) AS paidamount FROM orders JOIN customers ON orders.customerid = customers.customerid JOIN menu ON orders.drinkid = menu.drinkid JOIN staffmembers ON orders.staffid = staffmembers.staffid GROUP BY ordernum, cashiername, custname, custphonenum ORDER BY orders.orderid DESC LIMIT 2000;`;

        const previousOrders = await db.query(query);

        const previousOrdersList = previousOrders.rows;

        res.render('previousorders', { previousOrdersList }); 

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

// redirects page to staff page with staff details
router.get('/:orderid', async (req, res) => {
    try {
        const query = `SELECT customers.name AS custname, customers.phonenumber AS custphonenum, staffmembers.name AS cashiername, orders.orderid AS ordernum, MAX(orders.dateordered) AS orderdate, SUM(orders.amountpaid) AS paidamount FROM orders JOIN customers ON orders.customerid = customers.customerid JOIN menu ON orders.drinkid = menu.drinkid JOIN staffmembers ON orders.staffid = staffmembers.staffid  WHERE orders.orderid = $1 GROUP BY ordernum, cashiername, custname, custphonenum ORDER BY orders.orderid DESC;`;

        const previousOrders = await db.query(query, [req.params.orderid]);

        const previousOrdersList = previousOrders.rows;

        res.render('previousorders', { previousOrdersList }); 

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

// redirects page to staff page with staff details
router.get('/view-bill/:orderid', async (req, res) => {
    try {
        const query = `SELECT menu.drinkname AS drink, COUNT(menu.drinkid), SUM(orders.amountpaid) FROM orders JOIN menu ON orders.drinkid = menu.drinkid WHERE orders.orderid = $1 GROUP BY menu.drinkid, orders.amountpaid ORDER BY menu.drinkid ASC;`;

        const previousOrders = await db.query(query, [req.params.orderid]);

        const previousOrdersList = previousOrders.rows;

        res.json(previousOrdersList);
        //res.render('previousorders', { previousOrdersList }); 

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;