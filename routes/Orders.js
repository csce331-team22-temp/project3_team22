const { isEmployeeLoggedIn } = require('../authMiddleware');
const db = require('../database');
const express = require('express');

const router = express.Router();

// redirects page to previous orders page with recent orders
router.get('/recent', isEmployeeLoggedIn, async (req, res) => {
    try {
        const query = `SELECT customers.name AS custname, customers.phonenumber AS custphonenum, staffmembers.staffid AS employeeid, staffmembers.name AS cashiername, orders.orderid AS ordernum, MAX(orders.dateordered) AS orderdate, SUM(orders.amountpaid) AS paidamount FROM orders JOIN customers ON orders.customerid = customers.customerid JOIN staffmembers ON orders.staffid = staffmembers.staffid GROUP BY employeeid, ordernum, cashiername, custname, custphonenum ORDER BY orders.orderid DESC LIMIT 2000;`;

        const previousOrders = await db.query(query);

        const previousOrdersList = previousOrders.rows;

        res.render('previousorders', { previousOrdersList }); 

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

// redirects page to previous orders page with specified order
router.get('/filter/orderid/:orderid', isEmployeeLoggedIn, async (req, res) => {
    try {
        const query = `SELECT customers.name AS custname, customers.phonenumber AS custphonenum, staffmembers.staffid AS employeeid, staffmembers.name AS cashiername, orders.orderid AS ordernum, MAX(orders.dateordered) AS orderdate, SUM(orders.amountpaid) AS paidamount FROM orders JOIN customers ON orders.customerid = customers.customerid JOIN staffmembers ON orders.staffid = staffmembers.staffid WHERE orders.orderid = $1 GROUP BY employeeid, ordernum, cashiername, custname, custphonenum ORDER BY orders.orderid DESC;`;

        const previousOrders = await db.query(query, [req.params.orderid]);

        const previousOrdersList = previousOrders.rows;

        res.render('previousorders', { previousOrdersList }); 

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

// redirects page to previous orders page with specified date range
router.get('/filter/daterange', isEmployeeLoggedIn, async (req, res) => {
    try {
        const startDate = req.query.start;
        const endDate = req.query.end;

        const query = `SELECT customers.name AS custname, customers.phonenumber AS custphonenum, staffmembers.staffid AS employeeid, staffmembers.name AS cashiername, orders.orderid AS ordernum, MAX(orders.dateordered) AS orderdate, SUM(orders.amountpaid) AS paidamount FROM orders JOIN customers ON orders.customerid = customers.customerid JOIN staffmembers ON orders.staffid = staffmembers.staffid WHERE date(orders.dateordered) BETWEEN $1 AND $2 GROUP BY employeeid, ordernum, cashiername, custname, custphonenum ORDER BY orders.orderid DESC;`;

        const previousOrders = await db.query(query, [startDate, endDate]);

        const previousOrdersList = previousOrders.rows;

        res.render('previousorders', { previousOrdersList }); 

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

// redirects page to previous orders page with specified customer phone number
router.get('/filter/phone/:phonenumber', isEmployeeLoggedIn, async (req, res) => {
    try {

        const query = `SELECT customers.name AS custname, customers.phonenumber AS custphonenum, staffmembers.staffid AS employeeid, staffmembers.name AS cashiername, orders.orderid AS ordernum, MAX(orders.dateordered) AS orderdate, SUM(orders.amountpaid) AS paidamount FROM orders JOIN customers ON orders.customerid = customers.customerid JOIN staffmembers ON orders.staffid = staffmembers.staffid WHERE customers.phonenumber = $1 GROUP BY employeeid, ordernum, cashiername, custname, custphonenum ORDER BY orders.orderid DESC;`;

        const previousOrders = await db.query(query, [req.params.phonenumber]);

        const previousOrdersList = previousOrders.rows;

        res.render('previousorders', { previousOrdersList }); 

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

// redirects page to previous orders page with specified cashier
router.get('/filter/cashier/:cashierid', isEmployeeLoggedIn, async (req, res) => {
    try {

        const query = `SELECT customers.name AS custname, customers.phonenumber AS custphonenum, staffmembers.staffid AS employeeid, staffmembers.name AS cashiername, orders.orderid AS ordernum, MAX(orders.dateordered) AS orderdate, SUM(orders.amountpaid) AS paidamount FROM orders JOIN customers ON orders.customerid = customers.customerid JOIN staffmembers ON orders.staffid = staffmembers.staffid WHERE orders.staffid = $1 GROUP BY employeeid, ordernum, cashiername, custname, custphonenum ORDER BY orders.orderid DESC LIMIT 2000;`;

        const previousOrders = await db.query(query, [req.params.cashierid]);

        const previousOrdersList = previousOrders.rows;

        res.render('previousorders', { previousOrdersList }); 

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

// fetches specified order's details
router.get('/view-bill/:orderid', isEmployeeLoggedIn, async (req, res) => {
    try {
        const query = `SELECT menu.drinkname AS drink, orders.amountpaid AS totalamount, orders.paymentmethod AS paymethod, orders.toppings AS chosentoppings, orders.drinksize AS sizeofdrink FROM orders JOIN menu ON orders.drinkid = menu.drinkid WHERE orders.orderid = $1 ORDER BY menu.drinkid ASC;`;

        const previousOrders = await db.query(query, [req.params.orderid]);

        const previousOrdersList = previousOrders.rows;

        res.json(previousOrdersList);

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/check-manager', async (req, res) => {
    if (req.user) {
        const user_email = req.user.emails[0].value;
        const query = `SELECT * FROM staffmembers WHERE email = $1 AND position = 'Manager';`;
        const result = await db.query(query, [user_email]);

        if (result.rowCount > 0) {
            return res.json({ success: true, isManager: true });
        } else {
            return res.json({ success: true, isManager: false });
        }
    } else {
        return res.status(401).json({ success: false, error: 'Something went wrong while checking the database' });
    }
});

module.exports = router;