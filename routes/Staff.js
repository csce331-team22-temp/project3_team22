const db = require('../database');
const express = require('express');
const { isManagerLoggedIn } = require('../authMiddleware');

const router = express.Router();

// redirects page to staff page with staff details
router.get('/page', isManagerLoggedIn, async (req, res) => {
    try {
        const query = `SELECT * FROM staffmembers ORDER BY staffid;`;
        const staffInfo = await db.query(query);

        const staffMembers = staffInfo.rows;

        res.render('staffview', { staffMembers }); 

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

// gets staff details
router.get('/info', isManagerLoggedIn, async (req, res) => {
    try {
        const query = `SELECT * FROM staffmembers ORDER BY staffid;`;
        const staffInfo = await db.query(query);

        const staffMembers = staffInfo.rows;

        res.status(200).json(staffMembers);

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

// displays the manager's dashboard page
router.get('/manager-dashboard', isManagerLoggedIn, (req, res) => {
    try {

        res.render('managerdashboard');

    } catch (error) {
        console.error('Failed to load manager dashboard', error);
    }
});

// add a new staff member
router.post('/add', isManagerLoggedIn, async (req, res) => {
    try {

        // parameters passed using JSON format
        const {
            name,
            position,
            email
        } = req.body;

        const query = `INSERT INTO staffmembers(staffid, name, position, email, datejoined) VALUES ($1, $2, $3, $4, NOW());`;

        const getMaxStaffID = await db.query(`SELECT MAX(staffid) AS maxid FROM staffmembers;`);

        const newStaffID = (getMaxStaffID.rows[0].maxid || 11819) + 1; // if no rows exist, then starting value is 11819

        await db.query(query, [newStaffID, name, position, email]);

        res.status(200).json({ message: 'New staff member successfully added.'});

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/update', isManagerLoggedIn, async (req, res) => {
    try {

        const {
            staffid,
            position,
            email
        } = req.body;

        const query = `UPDATE staffmembers SET position = $2, email = $3 WHERE staffid = $1;`;

        await db.query(query, [staffid, position, email]);

        res.status(200).json({ message: 'Staff details updated.'});

    } catch (error) {
        console.error('Failed to load manager dashboard', error);
    }
});

// redirects page to inventory page with inventory details
router.get('/inventory/page', isManagerLoggedIn, async (req, res) => {
    try {
        const query = `SELECT * FROM inventory ORDER BY itemid;`;
        const inventoryInfo = await db.query(query);

        const inventoryItems = inventoryInfo.rows;

        res.render('inventoryview', { inventoryItems }); 

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

// gets inventory details
router.get('/inventory/info', isManagerLoggedIn, async (req, res) => {
    try {
        const query = `SELECT * FROM inventory ORDER BY itemid;`;
        const inventoryInfo = await db.query(query);

        const inventoryItems = inventoryInfo.rows;

        res.status(200).json(inventoryItems);

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

// updates inventory details
router.put('/inventory/update', isManagerLoggedIn, async (req, res) => {
    try {

        const {
            itemid,
            itemname,
            quantity,
            usingitem
        } = req.body;

        const query = `UPDATE inventory SET itemname = $2, quantity = $3, usingitem = $4 WHERE itemid = $1;`;

        await db.query(query, [itemid, itemname, quantity, usingitem]);

        res.status(200).json({ message: 'Inventory details updated.'});

    } catch (error) {
        console.error('Failed to load manager dashboard', error);
    }
});

// add a new inventory item
router.post('/inventory/add', isManagerLoggedIn, async (req, res) => {
    try {

        // parameters passed using JSON format
        const {
            itemname,
            quantity,
            usingitem
        } = req.body;

        const query = `INSERT INTO inventory VALUES ($1, $2, $3, $4);`;

        const getMaxItemID = await db.query(`SELECT MAX(itemid) AS maxid FROM inventory;`);

        const newItemID = (getMaxItemID.rows[0].maxid || 0) + 1; // if no rows exist, then starting value is 0

        await db.query(query, [newItemID, itemname, quantity, usingitem]);

        res.status(200).json({ message: 'New inventory item successfully added.'});

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;