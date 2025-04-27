// keeps track of whether or not staff details are being updated
let isEditing = false;

// main buttons in the staff page
const addNewMemberBtn = document.getElementById("addMemberBtn");
const editBtn = document.getElementById("editStaffBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const goBackBtn = document.getElementById("goBackBtn");

// elements of the new member form
const addMemberPopup = document.getElementById("newMemberPopup");
const inputName = document.getElementById("nameInput");
const inputEmail = document.getElementById("emailInput");

// allows the user to change position of a specified staff member
async function changePosition(staffid) {
    const position = document.getElementById(`positionBtn-${staffid}`);

    if (position.innerText == "Manager") {
        position.innerText = "Employee";
    } else {
        position.innerText = "Manager";
    }
}

// displays a form/popup that asks for new member required information
async function newMemberInput() {
    addMemberPopup.style.display = "flex";
}

// adds a new staff member by taking required inputs and also adds it to the database
async function submitNewMember() {

    // requires the user to fill in his/her necessary information before being added to the database
    if (inputName.value.length > 0 && inputEmail.value.length > 0) {

        const selectedPosition = document.querySelector('input[name="position"]:checked');

        await fetch('/staff/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: inputName.value,
                position: selectedPosition.value,
                email: inputEmail.value
            })
        });

        closeNewMemberPopup();

        // reloads the page
        window.location.href = "/staff/page";
    }
    else {
        if (inputName.value.length == 0) {
            inputName.style.borderColor = "red";
        }

        if (inputEmail.value.length == 0) {
            inputEmail.style.borderColor = "red";
        }
    }
}

// closes the popup and resets the input field values to empty
async function closeNewMemberPopup() {
    inputName.value = "";
    inputName.style.borderColor = "black";

    inputEmail.value = "";
    inputEmail.style.borderColor = "black";

    addMemberPopup.style.display = "none";
}

// edits the staff details and calls /staff/update API route to update the database
async function editStaff(staffMembers) {

    // converts the given data into JSON format to update database
    const jsonArray = JSON.parse(staffMembers);

    if (isEditing == false) {

        isEditing = true;

        // buttons' design changes when editing
        editBtn.innerText = "Finish Modifying";
        editBtn.style.border = 'solid black 2px'

        addNewMemberBtn.disabled = true;
        addNewMemberBtn.style.backgroundColor = "lightgray";

        cancelEditBtn.disabled = false;
        cancelEditBtn.style.backgroundColor = "red";

        goBackBtn.disabled = true;
        goBackBtn.style.backgroundColor = "lightgray";

        // allows the user to change position of every staff member
        jsonArray.forEach(obj => {
            const empPositionBtn = document.getElementById(`positionBtn-${obj['staffid']}`)
            empPositionBtn.disabled = false;
            empPositionBtn.style.backgroundColor = '#a0522d';

            document.getElementById(`emailInput-${obj['staffid']}`).disabled = false;
        });
    }
    else {
        isEditing = false;

        // buttons' design changes when not editing
        editBtn.innerText = "Modify";
        editBtn.style.border = 'none';

        addNewMemberBtn.disabled = false;
        addNewMemberBtn.style.backgroundColor = "#009879";

        cancelEditBtn.disabled = false;
        cancelEditBtn.style.backgroundColor = "darkgray";

        goBackBtn.disabled = false;
        goBackBtn.style.backgroundColor = "#f44336";

        // API route is called for each staff member to update his/her details in the database also
        jsonArray.forEach(obj => {

            const empPositionBtn = document.getElementById(`positionBtn-${obj['staffid']}`);
            const empNewPosition = empPositionBtn.innerText;
            empPositionBtn.style.backgroundColor = 'darkgray';
            empPositionBtn.disabled = true;
            
            const empEmailInput = document.getElementById(`emailInput-${obj['staffid']}`);
            const empNewEmail = empEmailInput.value;
            empEmailInput.disabled = true;


            fetch('/staff/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    staffid: obj['staffid'],
                    position: empNewPosition,
                    email: empNewEmail
                })
            });
        });
        
    }
}

// cancels the new changes when editing and retrieves the existing staff details from the database
async function cancelEditing(staffMembers) {
    
    const jsonArray = JSON.parse(staffMembers);
    
    cancelEditBtn.disabled = true;
    cancelEditBtn.style.backgroundColor = "darkgray";

    const response = await fetch("/staff/info");
    const staffData = await response.json();

    jsonArray.forEach(obj => {

        const empPositionBtn = document.getElementById(`positionBtn-${obj['staffid']}`);
        empPositionBtn.style.backgroundColor = 'darkgray';
        empPositionBtn.disabled = true;
        
        const empEmailInput = document.getElementById(`emailInput-${obj['staffid']}`);
        empEmailInput.disabled = true;

        const staffMember = staffData.find(member => member.staffid == obj.staffid);

        if (staffMember) {
            empPositionBtn.innerText = staffMember.position;
            empEmailInput.value = staffMember.email;
        }

    });

    isEditing = false;

    editBtn.disabled = false;
    editBtn.innerText = "Modify";
    editBtn.style.border = "none";

    addNewMemberBtn.disabled = false;
    addNewMemberBtn.style.backgroundColor = "#009879";

    goBackBtn.disabled = false;
    goBackBtn.style.backgroundColor = "#f44336";
}

async function deleteStaffMember(staffMemberToBeDeleted) {
    const confirmDeleteStaffMember = window.confirm(`Warning: Deleting this staff member with ID of ${staffMemberToBeDeleted} will also delete the previous orders that are placed by this staff member which will affect report analysis! Click OK to confirm delete!`);

    if (confirmDeleteStaffMember) {
        const response = await fetch('/staff/delete', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },

            body: JSON.stringify({
              staffid: staffMemberToBeDeleted
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        window.location.href = `/staff/page`;
    }
}

// redirects to manager dashboard
async function goToDashboard() {
    window.location.href = "/staff/manager-dashboard";
}