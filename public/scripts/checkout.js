function togglePaymentOptions() {
    const paymentOptionsDiv = document.getElementById('paymentOptions');
    const checkoutOptionsDiv = document.getElementById('checkoutButtons');

    if (paymentOptionsDiv.style.visibility === 'hidden' || paymentOptionsDiv.style.visibility === '') {
        paymentOptionsDiv.style.visibility = 'visible';
        checkoutOptionsDiv.style.visibility = 'hidden';
    } else {
        paymentOptionsDiv.style.visibility = 'hidden';
        checkoutOptionsDiv.style.visibility = 'visible';
    }
}

// function clearOrder() {
//     fetch('/checkout/clear', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({})
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             window.location.href = '/customers';
//         } else {
//             alert('Error clearing order.');
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('Error clearing order.');
//     });
// }

// Function to remove an item from the cart by sending a POST request to the server
function removeFromCart(name, price, index) {
    fetch('/customers/remove-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const itemElement = document.getElementById(`item-${index}`);
            if (itemElement) {
                itemElement.remove();
            }

            const totalElement = document.getElementById('cartTotal');
            const currentTotal = parseFloat(totalElement.textContent);
            const newTotal = (currentTotal - parseFloat(price)).toFixed(2);
            totalElement.textContent = newTotal;
            
            console.log('Updated cart:', data.cart);

            alert('Item removed from the cart!');
        } else {
            alert('Error removing item.');
        }
    })
    .catch(error => console.error('Error:', error));
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