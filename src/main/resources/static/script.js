
const API_URL = "/api/persons";

const personForm = document.getElementById("personForm");
const personIdInput = document.getElementById("personId");
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const genderInput = document.getElementById("gender");
const phoneInput = document.getElementById("phoneNumber");

const tableBody = document.getElementById("personTableBody");
const message = document.getElementById("message");
const emptyMessage = document.getElementById("emptyMessage");
const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");

function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? "#c62828" : "#16794b";
}

async function readResponse(response) {
    if (!response.ok) {
        const details = await response.text();
        throw new Error(
            details || `Request failed with status ${response.status}`
        );
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

// READ: Retrieve all persons
async function loadPersons() {
    emptyMessage.textContent = "Loading persons...";
    tableBody.replaceChildren();

    try {
        const response = await fetch(API_URL);
        const persons = await readResponse(response);

        persons.forEach(person => {
            const row = document.createElement("tr");

            const values = [
                person.id,
                person.name,
                person.age,
                person.gender,
                person.phoneNumber
            ];

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value ?? "";
                row.appendChild(cell);
            });

            const actionsCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Edit";
            editButton.className = "edit";
            editButton.addEventListener("click", () => editPerson(person));

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete";
            deleteButton.addEventListener(
                "click",
                () => deletePerson(person.id)
            );

            actionsCell.append(editButton, deleteButton);
            row.appendChild(actionsCell);
            tableBody.appendChild(row);
        });

        emptyMessage.textContent = persons.length === 0
            ? "No person records found."
            : "";
    } catch (error) {
        emptyMessage.textContent = "Could not load person records.";
        showMessage(error.message, true);
    }
}

// CREATE or UPDATE: Submit the form
personForm.addEventListener("submit", async event => {
    event.preventDefault();

    const id = personIdInput.value;

    const person = {
        name: nameInput.value.trim(),
        age: Number(ageInput.value),
        gender: genderInput.value,
        phoneNumber: phoneInput.value.trim()
    };

    const isEditing = id !== "";

    try {
        const response = await fetch(
            isEditing ? `${API_URL}/${id}` : API_URL,
            {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(person)
            }
        );

        await readResponse(response);

        showMessage(
            isEditing
                ? "Person updated successfully!"
                : "Person created successfully!"
        );

        resetForm();
        await loadPersons();
    } catch (error) {
        showMessage(error.message, true);
    }
});

// Load a person's details into the form
function editPerson(person) {
    personIdInput.value = person.id;
    nameInput.value = person.name;
    ageInput.value = person.age;
    genderInput.value = person.gender;
    phoneInput.value = person.phoneNumber;

    formTitle.textContent = "Edit Person";
    submitButton.textContent = "Update Person";
    cancelButton.hidden = false;

    showMessage(`Editing person ID ${person.id}`);
    personForm.scrollIntoView({ behavior: "smooth" });
}

// DELETE: Remove a person
async function deletePerson(id) {
    if (!confirm(`Are you sure you want to delete person ID ${id}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        await readResponse(response);

        showMessage("Person deleted successfully!");
        await loadPersons();
    } catch (error) {
        showMessage(error.message, true);
    }
}

// Reset the form to create mode
function resetForm() {
    personForm.reset();
    personIdInput.value = "";
    formTitle.textContent = "Add Person";
    submitButton.textContent = "Save Person";
    cancelButton.hidden = true;
}

cancelButton.addEventListener("click", resetForm);

// Load records when the page opens
loadPersons();
