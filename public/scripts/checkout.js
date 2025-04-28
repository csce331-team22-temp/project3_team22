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

            updatePaymentButtons();

        } else {
            alert('Error removing item.');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to clear the cart by sending a POST request to the server
function clearCartAndRedirect() {
    fetch('/customers/clear-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const cartItems = document.querySelectorAll('.textBesideButton');
            cartItems.forEach(item => item.remove());

            const totalElement = document.getElementById('cartTotal');
            if (totalElement) {
                totalElement.textContent = '0.00';
            } else {
                console.error('cartTotal element not found.');
            }

            localStorage.removeItem('reloadedOnce');
            window.location.href = "/logout?loginMessage=";

        } else {
            alert('Error clearing cart.');
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
            // alert('Order successfully inserted into the database!');
            togglePaymentOptions();
            window.location.href = '/';
        } else {
            alert('Error inserting order.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error inserting order #2.');
    });
    
}

// Function to enable/disable payment buttons depending on if an item is in the cart
function updatePaymentButtons() {
    const totalElement = document.getElementById('cartTotal');
    const cardCheckoutButton = document.getElementById('cardCheckout');
    const cashCheckoutButton = document.getElementById('cashCheckout');
    
    const total = parseFloat(totalElement.textContent);

    // If the total is greater than 0, enable the buttons; otherwise, disable them.
    if (total > 0) {
        cardCheckoutButton.disabled = false;
        cashCheckoutButton.disabled = false;
    } else {
        cardCheckoutButton.disabled = true;
        cashCheckoutButton.disabled = true;
    }
}

window.onload = updatePaymentButtons;