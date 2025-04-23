const orderNumInput = document.getElementById("ordernuminput");

const orderView = document.getElementById("orderView");
const orderDetails = document.getElementById("orderDetails");

const filterOptions = document.querySelectorAll('.filter-option');

// Handle changes
filterOptions.forEach(option => {
    const radio = option.querySelector('input[type="radio"]');

    radio.addEventListener('change', () => {
        filterOptions.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
    });

    // Handle initial selected state on page load
    if (radio.checked) {
        option.classList.add('selected');
    }
});

function filterOrders() {

    const selectedFilter = document.querySelector('input[name="filterType"]:checked');

    if (!selectedFilter) {
        alert("Please select a filter option.");
        return;
    }

    const filterType = selectedFilter.value;
    
    switch (filterType) {
        case "orderid":
            const orderId = document.getElementById("orderid").value;
            if (!orderId) {
                alert("Please enter an Order ID!");
                return;
            }  
            
            window.location.href = "/orders/filter/orderid/" + orderId;
            break;

        case "daterange":
            const startDate = document.getElementById("startDate").value;
            const endDate = document.getElementById("endDate").value;

            if (!startDate || !endDate) {
                alert("Please select both start and end dates!");
                return;
            }

            window.location.href = `/orders/filter/daterange?start=${startDate}&end=${endDate}`;
            break;

        case "phone":
            const phone = document.getElementById("phone").value.trim();
            if (!phone || !/^\d{10}$/.test(phone)) {
                alert("Please enter a valid 10-digit phone number!");
                return;
            }
            window.location.href = `/orders/filter/phone/${phone}`;
            break;

        case "cashier":
            const cashierId = document.getElementById("cashierid").value.trim();
            if (!cashierId) {
                alert("Please enter a Cashier ID!");
                return;
            }
            window.location.href = `/orders/filter/cashier/${cashierId}`;
            break;

        default:
            alert("Unknown filter option selected.");
            return;
    }
}

function getRecentOrders() {
    window.location.href = '/orders/recent';
}

async function showBill(orderNum) {

    const response = await fetch("/orders/view-bill/" + orderNum);
    const mydata = await response.json();
    
    let totalAmount = 0.0;

    for (let i = 0; i < mydata.length; i++) {
        totalAmount += parseFloat(mydata[i].totalamount);
    }

    let payMethod = mydata[0]?.paymethod || "N/A";
    payMethod = payMethod.slice(0, 1).toUpperCase() + payMethod.slice(1);

    // order details in a table format
    let tableHTML = `
        <h1 id="orderTitle">Order ID: ${orderNum}</h1>
        <table id="orderTable">
            <thead>
                <tr>
                    <th>Drink</th>
                    <th>Quantity</th>
                    <th>Amount ($)</th>
                </tr>
            </thead>
            <tbody>
                ${mydata.map(obj => `
                    <tr>
                        <td>${obj.drink}</td>
                        <td>${obj.drinkcount}</td>
                        <td>${obj.totalamount}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
        <div id="orderSummary">
            <p><strong>Total Amount Paid:</strong> $${totalAmount}</p>
            <p><strong>Payment Method:</strong> ${payMethod}</p>
        </div>
        <button id="closeBtn">Close</button>
    `;

    orderDetails.innerHTML = tableHTML;
    orderView.style.display = "flex";

    document.getElementById("closeBtn").onclick = () => {
        orderView.style.display = "none";
    };

    if (localStorage.getItem('textspeech') === 'true') {
        const elements = document.querySelectorAll('button, a, p, h1, h2, h3, label, span, th, td');

        elements.forEach(el => {
            el.addEventListener('mouseover', () => speakText(el.innerText || el.value));
        });
    }
}

function goToDashboard() {
    fetch('/orders/check-manager', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.isManager) {
                window.location.href = '/user-access-page'; // manager dashboard
            } else {
                window.location.href = '/menu'; // employee dashboard
            }
        } else {
            alert(data.error || 'Unable to verify your access.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Something went wrong while checking access.');
    });
}