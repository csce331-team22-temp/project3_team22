const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const path = require("path");

// create express app
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

// create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

// add process hook to shutdown pool
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});

app.use(express.json());
	 	 	 	
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

const staffRoute = require('./routes/Staff');
const customersRoute = require('./routes/Customers');
const ordersRoute = require('./routes/Orders');

const loginRoute = require('./routes/Login');
const rewardsRoute = require('./routes/Rewards');

const menuRoute = require('./routes/menu');



// routes
app.use('/staff', staffRoute);
app.use('/customers', customersRoute);
app.use('/orders', ordersRoute);

app.use("/customers/login", loginRoute);
app.use("/customers/rewards", rewardsRoute);
app.use('/menu', menuRoute);


app.listen(port, () => {
    console.log(`Server running on port ${port}`); // http://localhost:3000/
});
