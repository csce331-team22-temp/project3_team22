const db = require('../database');
const express = require('express');
const router = express.Router();
const rewards = require('./Rewards');

router.get('/', (req, res) => {
    res.render('login'); 
})

router.post('/login-request', (req, res) => {
    
    let phone = validPhoneNumber(req.body['phone']);
    if (phone === "-1") {
        res.status(400).json("Invalid Phone Number");
        return;
    }

    db.query("SELECT * from Customers WHERE phonenumber ='"+phone +"' LIMIT 1")
    .then(query_res => {
        if (query_res.rowCount === 0) {
            res.status(404).json("Phone Number Not Found");
            return;
        }
        rewards.currentCustomer = query_res.rows[0];
        res.status(200).json("Sucessful Login");
    });
});

router.post("/signup-request", (req, res) => {
    let phone = validPhoneNumber(req.body['phone']);
    if (phone ==="-1") {
        res.status(400).json("Invalid Phone Number");
        return;
    }

    let fullName = req.body['name'];
    if (fullName.length > 50 || fullName.length < 2) {
        res.status(400).json("Invalid Name");
        return;
    }

    db.query("SELECT * FROM customers WHERE phonenumber = $1 LIMIT 1", [phone])
    .then(query_res => {
        if (query_res.rowCount > 0) {
            res.status(400).json("Account Already Created");
            throw new Error();
        }
        return db.query("select MAX(customerid) from customers");
    })
    .then(query_res => {
        max_customerid = query_res.rows[0]['max'];
        let query ="INSERT INTO Customers (customerid, name, phonenumber, pearls, dateregistered) VALUES ($1, $2, $3, $4, $5)";
        let params = [max_customerid + 1, fullName, phone, 0, new Date().toISOString()];
        
        return db.query(query, params)        
    })
    .then(query_res => {
        if (query_res.rowCount === 1 && query_res.command === "INSERT"){
            res.status(200).json("Sucessful Registration");
        }
        else {
            res.status(500).json("Issue Registering Account");
        }
    })
    .catch(x => {});
});



function validPhoneNumber(phone) {
    if (phone.length > 20) return "-1";
    phone = phone.replace("-", "");
    if (phone.length == 10 && phone.replaceAll(/\d/g, "") === ""){
        return phone;
    }
    return "-1";
}

module.exports = router;