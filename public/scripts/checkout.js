function togglePaymentOptions() {
    var paymentDiv = document.getElementById('payment-options');
    if (paymentDiv.style.display === 'none') {
        paymentDiv.style.display = 'block'; // Show the div
    } else {
        paymentDiv.style.display = 'none'; // Hide the div
    }
}

function clearOrder() {
    fetch('/checkout/clear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/customers';
        } else {
            alert('Error clearing order.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error clearing order.');
    });
}

// Function to handle payment selection
function pay(method) {
    // Send the data to the server
    fetch('/customers/checkout/payment', {
        method: 'POST',  // Specify the HTTP method
        headers: {
            'Content-Type': 'application/json'  // Indicate the type of content being sent
        },
        body: JSON.stringify({ paymentMethod: method })  // Send the 'credit' string as the body
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Order successfully inserted into the database!');
            togglePaymentOptions(); // Close the payment options div after selection
            window.location.href = '/customers';
        } else {
            alert('Error inserting order.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error inserting order.');
    });
    
}