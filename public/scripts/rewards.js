const amtDrinksToDisplay = 10;
const d = document;

var redeemed_items = [];
var allDrinks = [];
var pageCount = 0;
var currentPage = 0;

function drinkGridBehavior(event) {
    const thisDrink = event.currentTarget;
    const selected = thisDrink.getAttribute('selected'); // or use dataset
    let drinkName = thisDrink.querySelector('.drink-name')?.innerText;
    drinkName = drinkName.replace("10 pearls \u{1F7E0}", "").trim();
         
    if (selected === 'true') {
        thisDrink.style.backgroundColor = null;
        thisDrink.style.outline = null;
        redeemed_items = redeemed_items.filter(item => item !== drinkName);
        thisDrink.setAttribute('selected', 'false');
        updatePearls(10);
    }
    else if (pearls < 10) {
        thisDrink.classList.add('invalid');
        setTimeout(() => {thisDrink.classList.remove('invalid');}, 2000);
    }
    else if (selected === 'false') {
        thisDrink.style.backgroundColor = 'darkgreen';
        thisDrink.style.outline = '0.2rem solid black';
        redeemed_items.push(drinkName);
        thisDrink.setAttribute('selected', 'true');
        updatePearls(-10);
    }
}

function makeDrinkGridItem(name, url) {
    var drink = document.createElement('div');
    drink.setAttribute('selected', 'false');
    drink.className = 'drink-grid-element';

    var dn = document.createElement('div');
    dn.className = 'drink-name';
    dn.innerText = name;

    var di = document.createElement('img');
    di.className = 'drink-img';
    di.src = url;

    drink.append(di, dn);

    drink.addEventListener('click', (event) => { drinkGridBehavior(event); });

    return drink;
}


async function getDrinks() {
    let res = await fetch('/customers/rewards/get-drinks', {
        method : 'GET',
        headers: {'Content-Type': 'application/json'},
    })
    let drinks = await res.json();

    pageCount = Math.ceil(drinks.length / amtDrinksToDisplay);
        
    let page = -1;
    for (let i = 0; i < drinks.length; ++i) {
        if (i % amtDrinksToDisplay == 0) {
            page++;
            allDrinks.push([]);
        }
        let dn = drinks[i]['drinkname'] + "\n10 pearls \u{1F7E0}";
        let url = "/images/" + drinks[i]['image_url'];
        let drinkItem = makeDrinkGridItem(dn, url);
        drinkItem.style.display = 'none';
        allDrinks[page].push(drinkItem);
    }
}

function updatePearls(amt) {
    pearls += amt;
    d.getElementById('pearls-balance').value = `${pearls} \u{1F7E0}`;
}


function selectPage(page_num) { // Zero-index page_num
    if (page_num < 0 || page_num >= allDrinks.length) {
        return;
    }
    let drinks = allDrinks[page_num];
    var drinksGrid = d.getElementById('drinks-grid');
    drinksGrid.innerHTML = '';
    for (let i = 0; i < drinks.length; ++i) {
        let d = drinks[i];
        d.style.display = null;
        drinksGrid.append(d);
    }

    currentPage = page_num;
    return;
}


async function redeem_drinks() {
    var response = await fetch("/customers/rewards/redeem-drinks", {
        method : 'POST', 
        body : {drinks : redeemed_items}
    });

    if (response.status() == 200) {
        alert(`Redeemed Item(s) (${redeemed_items})!`);
    }
    else {
        alert("Issue redeeming drinks. Please verify you have enough pearls for purchase and try again.");
    }
    resetDrinks(currentPage);
}
function resetDrinks() {

    allDrinks.flat().forEach((item) => {
        let selected = item.getAttribute("selected");
        if (selected === "true") {
            updatePearls(-10);
            item.click();
        }
    })
    redeemed_items = [];
    selectPage(currentPage);
}
function setupPage() {
    pearls = parseInt(pearls);

    d.getElementById('redeem-btn').addEventListener('click', () => {
      
        redeem_drinks();
    });


    d.getElementById('cart-btn').addEventListener('click', () => { 
        window.location.href = '/customers/checkout';
    });


    d.getElementById('left-panel').addEventListener('click', () => {
        let p = currentPage - 1;
        if (p >= 0 && p < pageCount) {
            selectPage(p);
        }
    });
    d.getElementById('right-panel').addEventListener('click', () => {
        let p = currentPage + 1;
        if (p >= 0 && p < pageCount) {
            selectPage(p);
        }
    });

    getDrinks().then(() => {selectPage(currentPage); console.log(pageCount);});

}

window.onload = () => {setupPage();}