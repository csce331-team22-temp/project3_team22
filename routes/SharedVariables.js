const db = require('../database');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var currentCustomer = null;

exports.modifyPearls = async function (amt) {
    if (amt == null) amt = 10; // Default for refunding
    db.query("UPDATE customers SET pearls = pearls + $1 WHERE customerid = $2", [amt, currentCustomer.customerid]);
}
exports.resetCustomer = function (orderData) {
    let total = 0;
    for (const item of orderData) {
        total += item.itemPrice;
    }
    total *= .01;
    total = Math.floor(total);
    exports.modifyPearls(total);

    currentCustomer = null; 
}
// exports.getCustomerID = function () { 
//     if (exports.currentCustomer == null) return 0;
//     return exports.currentCustomer.customerid;
// }
exports.getCustomerID = function () { 
    if (currentCustomer == null) return 0;
    return currentCustomer.customerid;
}

exports.setCurrentCustomer = function (cc) {currentCustomer = cc;}
exports.getCurrentCustomer = function () {return currentCustomer;}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

