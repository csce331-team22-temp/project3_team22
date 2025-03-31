document.getElementById("staffBtn").addEventListener("click", async function () {
    window.location.href = "/staff/page";
});

document.getElementById("inventoryBtn").addEventListener("click", async function () {
    window.location.href = "/staff/inventory/page";
});

function goToMain() {
    window.location.href = "/staff/login";
}