const db = require('./database');


async function isManagerLoggedIn(req, res, next) {
    if (req.user) {
        const user_email = req.user.emails[0].value;

        const query = `SELECT * FROM staffmembers WHERE email = $1 AND position = 'Manager';`;

        const staffMemberInfo = await db.query(query, [user_email]);

        if (staffMemberInfo.rowCount > 0) {
            next();
        } 
        else {
            res.redirect('/');
        }
        
    } else {
        res.redirect('/');
    }
}

async function isEmployeeLoggedIn(req, res, next) {
    if (req.user) {
        const user_email = req.user.emails[0].value;

        const query = `SELECT * FROM staffmembers WHERE email = $1 AND position = 'Employee';`;

        const staffMemberInfo = await db.query(query, [user_email]);

        if (staffMemberInfo.rowCount > 0) {
            next();
        } 
        else {
            res.redirect('/');
        }
        
    } else {
        res.redirect('/');
    }
}

module.exports = { isManagerLoggedIn, isEmployeeLoggedIn };