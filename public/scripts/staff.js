let isEditing = false;

const addNewMemberBtn = document.getElementById("addMemberBtn");
const editBtn = document.getElementById("editStaffBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const goBackBtn = document.getElementById("goBackBtn");

async function changePosition(staffid, staffposition) {
    const position = document.getElementById(`positionBtn-${staffid}`);

    if (position.innerText == "Manager") {
        position.innerText = "Employee";
    } else {
        position.innerText = "Manager";
    }
}

async function addNewMember() {

}

async function editStaff(staffMembers) {

    const jsonArray = JSON.parse(staffMembers);

    if (isEditing == false) {

        isEditing = true;

        editBtn.innerText = "Finish Modifying";
        editBtn.style.border = 'solid black 2px'

        addNewMemberBtn.disabled = true;
        addNewMemberBtn.style.backgroundColor = "darkgray";

        cancelEditBtn.disabled = false;
        cancelEditBtn.style.backgroundColor = "red";

        goBackBtn.disabled = true;
        goBackBtn.style.backgroundColor = "darkgray";

        jsonArray.forEach(obj => {
            const empPositionBtn = document.getElementById(`positionBtn-${obj['staffid']}`)
            empPositionBtn.disabled = false;
            empPositionBtn.style.backgroundColor = '#145da0';

            document.getElementById(`passwordInput-${obj['staffid']}`).disabled = false;
        });
    }
    else {
        isEditing = false;

        editBtn.innerText = "Modify";
        editBtn.style.border = 'none';

        addNewMemberBtn.disabled = false;
        addNewMemberBtn.style.backgroundColor = "green";

        cancelEditBtn.disabled = false;
        cancelEditBtn.style.backgroundColor = "darkgray";

        goBackBtn.disabled = false;
        goBackBtn.style.backgroundColor = "black";

        jsonArray.forEach(obj => {

            const empPositionBtn = document.getElementById(`positionBtn-${obj['staffid']}`);
            const empNewPosition = empPositionBtn.innerText;
            empPositionBtn.style.backgroundColor = 'darkgray';
            empPositionBtn.disabled = true;
            
            const empPasswordInput = document.getElementById(`passwordInput-${obj['staffid']}`);
            const empNewPassword = empPasswordInput.value;
            empPasswordInput.disabled = true;


            fetch('/staff/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    staffid: obj['staffid'],
                    position: empNewPosition,
                    password: empNewPassword
                })
            });
        });
        
    }
}

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
        
        const empPasswordInput = document.getElementById(`passwordInput-${obj['staffid']}`);
        empPasswordInput.disabled = true;

        const staffMember = staffData.find(member => member.staffid == obj.staffid);

        if (staffMember) {
            empPositionBtn.innerText = staffMember.position;
            empPasswordInput.value = staffMember.password;
        }

    });

    isEditing = false;

    editBtn.disabled = false;
    editBtn.innerText = "Modify";
    editBtn.style.border = "none";

    addNewMemberBtn.disabled = false;
    addNewMemberBtn.style.backgroundColor = "green";

    goBackBtn.disabled = false;
    goBackBtn.style.backgroundColor = "black";
}