document.getElementById("staffBtn").addEventListener("click", async function () {
    window.location.href = "/staff/page";
});

document.getElementById("inventoryBtn").addEventListener("click", async function () {
    window.location.href = "/staff/inventory/page";
});

document.getElementById("reportsBtn").addEventListener("click", async function () {
    window.location.href = "/staff/x-report";
});

function goToMain() {
    window.location.href = "/staff/login";
}