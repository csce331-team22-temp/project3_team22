async function getDrinks() {
    let res = await fetch('/customers/rewards/get-drinks', {
        method : 'GET',
        headers: {'Content-Type': 'application/json'},
    })
    let drinks = await res.json();

    var drinkSelect = document.getElementById('drinks');
    for (var i = 0; i < drinks.length; ++i) {
        let opt = document.createElement('option');
        let drinkName = drinks[i]['drinkname'];
        opt.value = drinkName;
        opt.innerHTML = drinkName + " (10 pearls &#128992)";
        drinkSelect.appendChild(opt);
    }
}

window.onload = () => {

getDrinks();
pearls = parseInt(pearls);

const d = document;
d.getElementById('redeem-btn').addEventListener('click', () => {

    let drinkOptions = d.getElementById('drinks');
    let selectedIndex = drinkOptions.selectedIndex;
    let item = drinkOptions.options[selectedIndex].value;
    pearls -= 10;
    d.getElementById('pearls-balance').value = `${pearls} &#128992`;
    alert(`Redeemed Item (${item})!`);
    
})
























}