const db = require('./database');


async function isManagerLoggedIn(req, res, next) {
    if (req.user) {
        const user_email = req.user.emails[0].value;

        const query = `SELECT * FROM staffmembers WHERE email = $1 AND position = 'Manager';`;

        const staffMemberInfo = await db.query(query, [user_email]);

        if (staffMemberInfo.rowCount > 0) {
            next(); // user is a manager
        } 
        else {
            res.redirect('/logout?loginMessage=User access denied!'); // user not found as a staff member
        }
        
    } else {
        res.redirect('/?loginMessage=Manager authentication is required!');
    }
}

async function isEmployeeLoggedIn(req, res, next) {
    if (req.user) {
        const user_email = req.user.emails[0].value;

        const query = `SELECT * FROM staffmembers WHERE email = $1;`;

        const staffMemberInfo = await db.query(query, [user_email]);

        if (staffMemberInfo.rowCount > 0) {
            next(); // user is a staff member
        } 
        else {
            res.redirect('/logout?loginMessage=User access denied'); // user not found as a staff member
        }
        
    } else {
        res.redirect('/?loginMessage=Staff user authentication is required!');
    }
}

module.exports = { isManagerLoggedIn, isEmployeeLoggedIn };