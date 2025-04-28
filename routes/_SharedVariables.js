const db = require('../database');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var currentCustomer = null;

exports.modifyPearls = async function (amt) {
    var customerid = 0;
    if (currentCustomer != null) customerid = currentCustomer.customerid;
    if (amt == null) amt = 10; // Default for refunding
    await db.query("UPDATE customers SET pearls = pearls + $1 WHERE customerid = $2", [amt, customerid]);
}

exports.getCustomerID = function () { 
    if (currentCustomer == null) return 0;
    return currentCustomer.customerid;
}
exports.resetCustomer = function (orderData) {
    let total = 0;
    for (const item of orderData) {
        total += item.itemPrice;
    }
    total = Math.floor(total);
    exports.modifyPearls(total, exports.getCustomerID());
    
    currentCustomer = null; 
}
exports.setCurrentCustomer = function (cc) {currentCustomer = cc;}
exports.getCurrentCustomer = function () {return currentCustomer;}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

