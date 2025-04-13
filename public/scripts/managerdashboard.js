function viewPreviousOrders() {
    window.location.href = "/orders/recent";
}

function goToInventory() {
    window.location.href = "/staff/inventory/page";
}

function goToStaff() {
    window.location.href = "/staff/page";
}

function goToMain() {
    window.location.href = "/logout?loginMessage=";
}

function generateProductUsageReport() {
    const startDateTime = document.getElementById('startDateInput').value;
    const endDateTime = document.getElementById('endDateInput').value;

    console.log(startDateTime);

    window.location.href = `/staff/inventory/report/${startDateTime}/${endDateTime}`;
}