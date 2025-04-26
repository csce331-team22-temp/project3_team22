// keeps track of whether or not inventory details are being updated
let isEditing = false;

// main buttons in the inventory page
const addNewItemBtn = document.getElementById("addItemBtn");
const editBtn = document.getElementById("editItemsBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const goBackBtn = document.getElementById("goBackBtn");

// elements of the new item form
const addItemPopup = document.getElementById("newItemPopup");
const inputName = document.getElementById("nameInput");
const inputQuantity = document.getElementById("quantityInput");

// displays a form/popup that asks for new member required information
async function newItemInput() {
    addItemPopup.style.display = "flex";
}

// adds a new inventory item by taking required inputs and also adds it to the database
async function submitNewItem() {

    // requires the user to fill in his/her necessary information before being added to the database
    if (inputName.value.length > 0 && inputQuantity.value.length > 0) {

        const usingItemSelection = document.querySelector('input[name="usingItemOptions"]:checked');

        await fetch('/staff/inventory/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                itemname: inputName.value,
                quantity: inputQuantity.value
            })
        });

        closeNewItemPopup();

        // reloads the page
        window.location.href = "/staff/inventory/page";
    }
    else {
        if (inputName.value.length == 0) {
            inputName.style.borderColor = "red";
        }

        if (inputQuantity.value.length == 0) {
            inputQuantity.style.borderColor = "red";
        }
    }
}

// resets the input values to empty and closes the form
async function closeNewItemPopup() {
    inputName.value = "";
    inputName.style.borderColor = "black";

    inputQuantity.value = "";
    inputQuantity.style.borderColor = "black";

    addItemPopup.style.display = "none";
}

// edits the inventory details and calls /staff/inventory/update API route to update the database
async function editInventory(inventoryItems) {
    const jsonArray = JSON.parse(inventoryItems);

    if (isEditing == false) {

        isEditing = true;

        // buttons' design changes when editing
        editBtn.innerText = "Finish Modifying";
        editBtn.style.border = 'solid black 2px'

        addNewItemBtn.disabled = true;
        addNewItemBtn.style.backgroundColor = "darkgray";

        cancelEditBtn.disabled = false;
        cancelEditBtn.style.backgroundColor = "red";

        goBackBtn.disabled = true;
        goBackBtn.style.backgroundColor = "darkgray";

        // allows the user to change position of every staff member
        jsonArray.forEach(obj => {
            const itemNameInput = document.getElementById(`itemname-${obj['itemid']}`)
            itemNameInput.disabled = false;

            const itemQuantityInput = document.getElementById(`itemquantity-${obj['itemid']}`)
            itemQuantityInput.disabled = false;

            if (itemUsingBtn.innerText == "Yes") {
                itemUsingBtn.style.backgroundColor = 'green';
            }
            else {
                itemUsingBtn.style.backgroundColor = 'red';
            }

        });
    }
    else {
        isEditing = false;

        // buttons' design changes when not editing
        editBtn.innerText = "Modify";
        editBtn.style.border = 'none';

        addNewItemBtn.disabled = false;
        addNewItemBtn.style.backgroundColor = "green";

        cancelEditBtn.disabled = false;
        cancelEditBtn.style.backgroundColor = "darkgray";

        goBackBtn.disabled = false;
        goBackBtn.style.backgroundColor = "#f44336";

        // API route is called for each staff member to update his/her details in the database also
        jsonArray.forEach(obj => {

            const itemNameInput = document.getElementById(`itemname-${obj['itemid']}`)
            itemNameInput.disabled = true;

            const itemQuantityInput = document.getElementById(`itemquantity-${obj['itemid']}`)
            itemQuantityInput.disabled = true;


            fetch('/staff/inventory/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itemid: obj['itemid'],
                    itemname: itemNameInput.value,
                    quantity: itemQuantityInput.value
                })
            });
        });
        
    }
}

// cancels the new changes when editing and retrieves the existing inventory details from the database
async function cancelEditing(inventoryItems) {
    const jsonArray = JSON.parse(inventoryItems);
    
    cancelEditBtn.disabled = true;
    cancelEditBtn.style.backgroundColor = "darkgray";

    const response = await fetch("/staff/inventory/info");
    const inventoryData = await response.json();

    jsonArray.forEach(obj => {

        const itemNameInput = document.getElementById(`itemname-${obj['itemid']}`)
        itemNameInput.disabled = true;

        const itemQuantityInput = document.getElementById(`itemquantity-${obj['itemid']}`)
        itemQuantityInput.disabled = true;

        const item = inventoryData.find(item => item.itemid == obj.itemid);

        if (item) {
            itemNameInput.value = item.itemname;
            itemQuantityInput.value = item.quantity;
        }

    });

    isEditing = false;

    editBtn.disabled = false;
    editBtn.innerText = "Modify";
    editBtn.style.border = "none";

    addNewItemBtn.disabled = false;
    addNewItemBtn.style.backgroundColor = "green";

    goBackBtn.disabled = false;
    goBackBtn.style.backgroundColor = "#f44336";
}

async function deleteItem(itemToBeDeleted) {
    const confirmDeleteItem = window.confirm(`Warning: Deleting this item will also remove it from any drinks that include it in their recipes! Click OK to confirm delete.`);

    if (confirmDeleteItem) {
        const response = await fetch('/staff/inventory/delete', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },

            body: JSON.stringify({
              itemid: itemToBeDeleted
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        window.location.href = `/staff/inventory/page`;
    }
}

// redirects to the manager dashboard
async function goToDashboard() {
    window.location.href = "/staff/manager-dashboard";
}



