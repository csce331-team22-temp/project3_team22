window.onload = (() => {


const d = document;

let swapDisplays = (signup_display, login_display, title_name) => {
    d.getElementById("customer-signup").style.display = signup_display;
    d.getElementById("customer-login").style.display = login_display;
    d.getElementById("title").innerHTML = title_name;
};

function perform_login(phone_number) {
    fetch('/customers/login/login-request', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({phone: phone_number})
    })

    .then(res => {
        if (res.status == 400) {
            alert("Invalid phone number. Please enter a valid phone number with only 10 digits.");
        }
        else if (res.status == 200) {
            document.location.href = "/customers/rewards";
        }
    });  
}

d.getElementById("make-account-button").addEventListener("click", ()=>swapDisplays("grid", "none", "Customer Signup"));
d.getElementById("login-account-button").addEventListener("click", () => swapDisplays("none", "grid", "Customer Login"));


d.getElementById("submit-btn").addEventListener("click", (event) => {
    let text = d.getElementById("phone-input").value;
    perform_login(text);
});

d.getElementById("register-btn").addEventListener("click", (event) => {
    let phone_text = d.getElementById('s-phone-input').value;
    let name_text = d.getElementById('name-input').value;
    fetch('/customers/login/signup-request', {
        method : 'POST',
        headers : {'Content-Type': 'application/json'},
        body : JSON.stringify({phone : phone_text, name : name_text})

    })
    .then(res => {
        if (res.status == 200) perform_login(phone_text);
        else alert(`Issue registering account. Status: ${res.status}`)
    })
})



d.getElementById('cart-btn').addEventListener('click', () => { 
    window.location.href = '/customers/checkout';
});









})



    