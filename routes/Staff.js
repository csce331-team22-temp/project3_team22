const db = require('../database');
const express = require('express');
const { isManagerLoggedIn } = require('../authMiddleware');

const router = express.Router();

// redirects page to staff page with staff details
router.get('/page', isManagerLoggedIn, async (req, res) => {
    try {
        const query = `
            SELECT *
            FROM staffmembers
            WHERE staffid > 0
            ORDER BY staffid;
        `;
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
        const query = `
            SELECT *
            FROM staffmembers
            WHERE staffid > 0
            ORDER BY staffid;
        `;
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

        const query = `
            INSERT INTO staffmembers(staffid, name, position, email, datejoined)
            VALUES ($1, $2, $3, $4, NOW());
        `;

        const getMaxStaffID = await db.query("SELECT MAX(staffid) AS maxid FROM staffmembers;");

        const newStaffID = (getMaxStaffID.rows[0].maxid || 11819) + 1; // if no rows exist, then starting value is 11819

        await db.query(query, [newStaffID, name, position, email]);

        res.status(200).json({ message: 'New staff member successfully added.'});

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

// delete a staff member
router.delete('/delete', isManagerLoggedIn, async (req, res) => {
    try {

        const {
            staffid
        } = req.body;
        
        await db.query(`DELETE FROM orders WHERE staffid = $1;`, [staffid]);

        await db.query(`DELETE FROM staffmembers WHERE staffid = $1;`, [staffid]);

        res.status(200).json({ message: `Staff member with an ID of ${staffid} is successfully deleted.`});

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

        const query = `
            UPDATE staffmembers
            SET position = $2, email = $3
            WHERE staffid = $1;
        `;

        await db.query(query, [staffid, position, email]);

        res.status(200).json({ message: 'Staff details updated.'});

    } catch (error) {
        console.error('Failed to load manager dashboard', error);
    }
});

// redirects page to inventory page with inventory details
router.get('/inventory/page', isManagerLoggedIn, async (req, res) => {
    try {
        const query = `
            SELECT *
            FROM inventory
            ORDER BY itemid;
        `;
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
        const query = `
            SELECT *
            FROM inventory
            ORDER BY itemid;
        `;
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
            quantity
        } = req.body;


        const query = `UPDATE inventory SET itemname = $2, quantity = $3 WHERE itemid = $1;`;


        await db.query(query, [itemid, itemname, quantity]);

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
            quantity
        } = req.body;


        const query = `
            INSERT INTO inventory (itemid, itemname, quantity)
            VALUES ($1, $2, $3);
        `;


        const getMaxItemID = await db.query("SELECT MAX(itemid) AS maxid FROM inventory;");

        const newItemID = (getMaxItemID.rows[0].maxid || 0) + 1; // if no rows exist, then starting value is 0

        await db.query(query, [newItemID, itemname, quantity]);

        res.status(200).json({ message: 'New inventory item successfully added.'});

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

// delete an inventory item
router.delete('/inventory/delete', isManagerLoggedIn, async (req, res) => {
    try {

        const {
            itemid
        } = req.body;
        
        await db.query(`DELETE FROM recipes WHERE itemid = $1;`, [itemid]);

        await db.query(`DELETE FROM inventory WHERE itemid = $1;`, [itemid]);

        res.status(200).json({ message: `Inventory item with an ID of ${itemid} is successfully deleted.`});

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

// product usage report
router.get('/inventory/report/:startdate/:endate', isManagerLoggedIn, async (req, res) => {
    try {

        const query = `
            SELECT
                i.itemname AS iname,
                COUNT(*) AS amountused
            FROM orders o
            JOIN recipes r ON o.drinkid = r.drinkid
            JOIN inventory i ON i.itemid = r.itemid
            WHERE o.dateordered BETWEEN $1 AND $2
            GROUP BY i.itemid
            ORDER BY i.itemid ASC;
        `;

        const inventoryItemUsage = await db.query(query, [req.params.startdate, req.params.endate]);

        const inventoryItemUsageData = inventoryItemUsage.rows;

        res.render('productusagereport', { inventoryItemUsageData });

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});



// generate reports for staff members
router.get('/reports', isManagerLoggedIn, async (req, res) => {
    try {

        res.render('reports');

    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

// gets data for the z report
router.get('/reports/z', isManagerLoggedIn, async (req, res) => {
    try {
        const paymentQuery = `
            SELECT
                SUM(CASE WHEN paymentmethod ILIKE 'Cash' THEN amountpaid ELSE 0 END)::NUMERIC AS cash,
                SUM(CASE WHEN paymentmethod ILIKE 'Credit' THEN amountpaid ELSE 0 END)::NUMERIC AS credit,
                SUM(CASE WHEN paymentmethod ILIKE 'Debit' THEN amountpaid ELSE 0 END)::NUMERIC AS debit,
                SUM(CASE WHEN paymentmethod ILIKE 'Gift Card' THEN amountpaid ELSE 0 END)::NUMERIC AS giftcard
            FROM orders
            WHERE DATE(dateordered) = CURRENT_DATE;
        `;
        const drinkSalesQuery = `
            SELECT
                m.drinkname,
                COUNT(*) AS quantity_sold,
                SUM(o.amountpaid)::NUMERIC AS total_sales
            FROM orders o
            JOIN menu m ON o.drinkid = m.drinkid
            WHERE DATE(o.dateordered) = CURRENT_DATE
            GROUP BY m.drinkname
            ORDER BY quantity_sold DESC;
        `;
        const paymentResult = await db.query(paymentQuery);
        const drinkSalesResult = await db.query(drinkSalesQuery);

        res.json({
            paymentSummary: paymentResult.rows[0] || {
                cash: 0, credit: 0, debit: 0, giftcard: 0
            },
            drinkSales: drinkSalesResult.rows
        });

    } catch (error) {
        console.error('Error fetching report data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// gets data for the x report
router.get('/reports/x', isManagerLoggedIn, async (req, res) => {
    try {
        const paymentQuery = `
            SELECT
                SUM(CASE WHEN paymentmethod ILIKE 'Cash' THEN amountpaid ELSE 0 END)::NUMERIC AS cash,
                SUM(CASE WHEN paymentmethod ILIKE 'Credit' THEN amountpaid ELSE 0 END)::NUMERIC AS credit,
                SUM(CASE WHEN paymentmethod ILIKE 'Debit' THEN amountpaid ELSE 0 END)::NUMERIC AS debit,
                SUM(CASE WHEN paymentmethod ILIKE 'Gift Card' THEN amountpaid ELSE 0 END)::NUMERIC AS giftcard
            FROM orders
            WHERE DATE(dateordered) = CURRENT_DATE;
        `;
        const drinkSalesQuery = `
            SELECT
                m.drinkname,
                COUNT(*) AS quantity_sold,
                SUM(o.amountpaid)::NUMERIC AS total_sales
            FROM orders o
            JOIN menu m ON o.drinkid = m.drinkid
            WHERE DATE(o.dateordered) = CURRENT_DATE
            GROUP BY m.drinkname
            ORDER BY quantity_sold DESC;
        `;
        const paymentResult = await db.query(paymentQuery);
        const drinkSalesResult = await db.query(drinkSalesQuery);

        res.json({
            paymentSummary: paymentResult.rows[0] || {
                cash: 0, credit: 0, debit: 0, giftcard: 0
            },
            drinkSales: drinkSalesResult.rows
        });

    } catch (error) {
        console.error('Error fetching report data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// displays the manager's dashboard page
router.get('/manager-dashboard', isManagerLoggedIn, (req, res) => {
    try {
        res.render('managerdashboard');
    } catch (error) {
        console.error('Failed to load manager dashboard', error);
        res.status(500).send('Internal Server Error'); // Make sure to send a response!
    }
});

// New route to fetch categories
router.get('/categories', isManagerLoggedIn, async (req, res) => {
    try {
        const categoryQuery = `
            SELECT DISTINCT category
            FROM menu
            ORDER BY category;
        `;
        const categoryResult = await db.query(categoryQuery);
        const categories = categoryResult.rows.map(row => row.category);
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
});


// Route to handle adding a new drinks
router.post('/add-drink', isManagerLoggedIn, async (req, res) => {
    try {
        const {
            name,
            category,
            price,
            ingredients,
            calories,
            macros,
            allergens,
            isNewCategory
        } = req.body;

        const ingredientsArray = ingredients.split(',');

        // 1. Get the next drink ID
        const lastDrinkResult = await db.query("SELECT MAX(drinkid) AS maxID FROM menu;");
        const newDrinkID = (lastDrinkResult.rows[0].maxid || 0) + 1;

        // 2. Insert into menu with nutritional info and allergens
        const menuQuery = `
            INSERT INTO menu (
                drinkid,
                drinkname,
                category,
                price,
                calories,
                allergens,
                ingredients,
                macros
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING drinkid;
        `;
        await db.query(
            menuQuery,
            [
                newDrinkID,
                name,
                category,
                price,
                calories,
                allergens,
                ingredients,
                macros
            ]
        );

        // 3. Process inventory items and insert into recipes
        for (const item of ingredientsArray) {
            const trimmedItem = item.trim();

            // a. Check if the item exists in inventory
            let itemResult = await db.query("SELECT itemid FROM inventory WHERE itemname = $1;", [trimmedItem]);

            let itemID;

            if (itemResult.rows.length > 0) {
                // Item exists, get its itemID
                itemID = itemResult.rows[0].itemid;
            } else {
                // b. Item doesn't exist, create it
                const lastItemResult = await db.query("SELECT MAX(itemid) AS maxID FROM inventory;");
                const newItemID = (lastItemResult.rows[0].maxid || 0) + 1;

                await db.query(
                    "INSERT INTO inventory (itemid, itemname, quantity) VALUES ($1, $2, $3);",
                    [newItemID, trimmedItem, 1000]
                );
                itemID = newItemID;
            }

            // c. Insert into recipes table
            await db.query("INSERT INTO recipes (drinkid, itemid) VALUES ($1, $2);", [newDrinkID, itemID]);
        }

        res.status(200).json({ message: 'Drink added successfully!' });
    } catch (error) {
        console.error('Error adding drink:', error);
        res.status(500).json({ message: 'Failed to add drink: ' + error.message });
    }
});

router.get('/reports/sales-report/:startDate/:endDate', isManagerLoggedIn, async (req, res) => {
    try {
        let startDate = new Date(req.params.startDate);
        let endDate = new Date(req.params.endDate);
        if (isNaN(startDate.getTime())|| isNaN(endDate.getTime())) {
            res.status(400).send("Bad start or end time for timestamp");
        };

        let query = "SELECT drinkname, COUNT(drinkname) as total_orders, SUM(price) as total_earned from Orders";
        query += " LEFT JOIN Menu using(drinkid)";     
        query += " WHERE dateordered >= $1 and dateordered <= $2 GROUP BY drinkname ORDER BY drinkname asc";  
        let salesReportData = (await db.query(query, [req.params.startDate, req.params.endDate])).rows;
        res.render('salesreport', {salesReportData});
    }
    catch {
        res.status(400).send("Issue retrieving data or bad timestamp.");
    }
});


module.exports = router;