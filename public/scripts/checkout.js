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
            
            // check if item removed was a reward item and send some garbage to rewards to notify that pearls need to be refunded
            if(price == 0.0) {
                fetch('customers/rewards/refund-pearls', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, price })
                })
            }

        } else {
            alert('Error removing item.');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to handle payment selection
function pay(method) {
    fetch('/customers/checkout/payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paymentMethod: method })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Order successfully inserted into the database!');
            togglePaymentOptions();
            window.location.href = '/menu';

            // // send some garbage to rewards so that it can handle resetting the customer
            // fetch('customers/rewards/reset-customer', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({ paymentMethod: method })
            // })
        } else {
            alert('Error inserting order.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error inserting order #2.');
    });
    
}