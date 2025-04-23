function viewPreviousOrders() {
    window.location.href = "/orders/recent";
}

function goToInventory() {
    window.location.href = "/staff/inventory/page";
}

function goToStaff() {
    window.location.href = "/staff/page";
}

document.getElementById("reportsBtn").addEventListener("click", async function () {
    window.location.href = "/staff/reports";
});

function goToMain() {
    localStorage.removeItem('reloadedOnce');
    window.location.href = "/logout?loginMessage=";
}

function generateProductUsageReport() {
    const startDateTime = document.getElementById('startDateInput').value;
    const endDateTime = document.getElementById('endDateInput').value;

    if (startDateTime && endDateTime) {
        window.location.href = `/staff/inventory/report/${startDateTime}/${endDateTime}`;
    } else {
        alert('Invalid input date(s)!');
    }
}
function generateSalesReport() {
    const startDateTime = document.getElementById('srStartDate').value;
    const endDateTime = document.getElementById('srEndDate').value;
    
    window.location.href = `/staff/reports/sales-report/${startDateTime}/${endDateTime}`
}