const db = require('../database');
const express = require('express');

const router = express.Router();

// gets every staff member's details
router.get('/info', async (req, res) => {
    try {
        const query = `SELECT * FROM staffmembers;`;
        const staffInfo = await db.query(query);

        const staffMembers = staffInfo.rows;

        res.render('staffview', { staffMembers }); 

        return staffMembers;

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

// get manager's details
router.get('/manager', async (req, res) => {
    try {
        const query = `SELECT * FROM staffmembers WHERE position = Manager;`;
        const managerInfo = await db.query(query);

        return managerInfo.rows;

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

// displays the manager's dashboard page
router.get('/manager-dashboard', async (req, res) => {
    try {

        res.render('managerdashboard')

    } catch (error) {
        console.error('Failed to load manager dashboard', error);
    }
});

// add a new staff member
router.post('/add', async (req, res) => {
    try {

        // parameters passed using JSON format
        const {
            name,
            position,
            password
        } = req.body;

        const query = `INSERT INTO staffmembers VALUES ($1, $2, $3, $4, NOW());`;

        const getMaxStaffID = await db.query(`SELECT MAX(staffid) AS maxid FROM staffmembers;`);

        const newStaffID = (getMaxStaffID.rows[0].maxid || 11819) + 1; // if no rows exist, then starting value is 11819

        await db.query(query, [newStaffID, name, position, password]);

        res.status(200).json({ message: 'New staff member successfully added.'});

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;