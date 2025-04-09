const menu = {
    "Milk Teas": [
        { name: "Taro Milk Tea", price: "$5.99", image: "images/taro-milk-tea.jpg" },
        { name: "Oreo Milk Tea", price: "$5.99", image: "images/oreo-milk-tea.jpg" },
        { name: "Thai Milk Tea", price: "$5.99", image: "images/thai-milk-tea.jpg" }
    ],
    "Fruit Teas": [
        { name: "Mango Tea", price: "$4.99", image: "images/mango-tea.jpg" },
        { name: "Peach Tea", price: "$4.99", image: "images/peach-tea.jpg" }
    ],
    "Brewed Teas": [
        { name: "Oolong Tea", price: "$3.99", image: "images/oolong-tea.jpg" },
        { name: "Green Tea", price: "$3.99", image: "images/green-tea.jpg" }
    ],
    "Ice-Blended Teas": [
        { name: "Taro Ice Blended", price: "$5.99", image: "images/taro-ice-tea.jpg" },
        { name: "Mango Ice Blended", price: "$5.99", image: "images/mango-ice-tea.jpg" }
    ]
};

const categoriesDiv = document.getElementById("categories");
const drinksDiv = document.getElementById("drinks");
const drinkListDiv = document.getElementById("drink-list");
const backButton = document.getElementById("back-btn");

// Function to display categories
function displayCategories() {
    categoriesDiv.innerHTML = "";
    Object.keys(menu).forEach(category => {
        const button = document.createElement("button");
        button.innerText = category;
        button.classList.add("category-button");
        button.addEventListener("click", () => displayDrinks(category));
        categoriesDiv.appendChild(button);
    });
}

// Function to display drinks
function displayDrinks(category) {
    categoriesDiv.style.display = "none";
    drinksDiv.style.display = "block";
    drinkListDiv.innerHTML = "";

    menu[category].forEach(drink => {
        const drinkDiv = document.createElement("div");
        drinkDiv.classList.add("drink-item");

        const img = document.createElement("img");
        img.src = drink.image;
        img.alt = drink.name;

        const name = document.createElement("h2");
        name.innerText = drink.name;

        const price = document.createElement("p");
        price.innerText = drink.price;

        drinkDiv.appendChild(img);
        drinkDiv.appendChild(name);
        drinkDiv.appendChild(price);
        drinkListDiv.appendChild(drinkDiv);
    });
}

// Back button functionality
backButton.addEventListener("click", () => {
    drinksDiv.style.display = "none";
    categoriesDiv.style.display = "block";
});

// Function to add items to the cart
function addItemToCart(name, price) {
    fetch('/customers/add-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Item added to the cart!');
        } else {
            alert('Error adding item.');
        }
    })
    .catch(error => console.error('Error:', error));

}

// Function to proceed to the checkout page
function proceedToCheckout() {
    window.location.href = '/customers/checkout';  // Redirect to checkout page
}

// Initialize categories on page load
displayCategories();
