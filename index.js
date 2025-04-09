const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const path = require("path");
const db = require("./database");

const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback'
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
)

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(express.urlencoded({ extended: false }));

const homeRoute = require('./routes/Home')

const staffRoute = require('./routes/Staff');
const customersRoute = require('./routes/Customers');
const ordersRoute = require('./routes/Orders');

const loginRoute = require('./routes/Login');
const rewardsRoute = require('./routes/Rewards');

const menuRoute = require('./routes/menu');



// routes
app.use('/', homeRoute);

app.use('/staff', staffRoute);
app.use('/customers', customersRoute);
app.use('/orders', ordersRoute);

app.use("/customers/login", loginRoute);
app.use("/customers/rewards", rewardsRoute);
app.use('/menu', menuRoute);

// google authentication
app.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/'}), async (req, res) => {
    
    const user_email = req.user.emails[0].value;
    
    const query = `SELECT * FROM staffmembers WHERE email = $1;`;

    const staffMemberInfo = await db.query(query, [user_email]);

    if (staffMemberInfo) {

        if(staffMemberInfo.rows[0].position == 'Manager') {
            res.redirect('/staff/manager-dashboard');
        } 
        else {
            res.redirect('/menu');
        }
        
    }
});

app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
    
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`); // http://localhost:3000/
});
