const orderNumInput = document.getElementById("ordernuminput");

function filterOrders() {
    window.location.href = "/orders/" + orderNumInput.value;
}

async function showBill(orderNum) {
    //console.log('Order ID: ' + orderNum);

    const response = await fetch("/orders/view-bill/" + orderNum);
    const mydata = await response.json();

    console.log(mydata);
}