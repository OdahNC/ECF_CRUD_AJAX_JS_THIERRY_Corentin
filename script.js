// Launch getData when an user open the web page
getData();
// editFormEployee variable declaration.
let editFormEmployee;
// Const declaration (represent all buttons of the page and the modal)
const MODAL = document.getElementById("form-data");
const REFRESHBTN = document.getElementById("refresh-data-button");
const CANCELBTN = document.getElementById("cancel-form-button");
const ADDBTN = document.getElementById("add-employee-button");
const SUBMITBTN = document.getElementById("submit-form-button");
const BURGERBTN = document.getElementById("burger-menu");
const BURGERMENU = document.getElementById("btn-of-burger-menu");
const BURGERADDBTN = document.getElementById("add-employee-button-menu");
const BURGERREFRESHBTN = document.getElementById("refresh-data-button-menu");
const CLOSEBTN = document.getElementById("close-btn");

/* Refresh */
// Refresh employee datas (with a click event on resfresh button)
REFRESHBTN.addEventListener("click", Refresh);
BURGERREFRESHBTN.addEventListener("click", Refresh);
function Refresh() {
  window.location.reload();
}

/* Data return function */
// This function pick-up the values of each field that user has fill
function getFormData() {
  return {
    name: document.getElementById("name").value,
    last_name: document.getElementById("last_name").value,
    job_title: document.getElementById("job_title").value,
    email: document.getElementById("email").value,
  };
}
console.log(getFormData);

/* Clear form field function */
// This function clean all fields value (after a submit for example)
function clearFormData() {
  document.getElementById("name").value = "";
  document.getElementById("last_name").value = "";
  document.getElementById("job_title").value = "";
  document.getElementById("email").value = "";
}

/* Show values of the Employee */
// Set each parameter of editDataCall() function into each field form
function setFormData(name, last_name, job_title, email) {
  document.getElementById("name").value = name;
  document.getElementById("last_name").value = last_name;
  document.getElementById("job_title").value = job_title;
  document.getElementById("email").value = email;
}

/* Edit an employee call function */
// This function activated when the user clicks on the edit button of an employee line
function editDataCall(id) {
  // Verification if modal is open or not. If yes, spawn alert to user.
  if (MODAL.style.display !== "block") {
    // Show modal
    showhideModal();
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        editFormEmployee = JSON.parse(this.response);
        setFormData(
          editFormEmployee["name"],
          editFormEmployee["last_name"],
          editFormEmployee["job_title"],
          editFormEmployee["email"]
        );
      }
    };
    request.open(
      "GET",
      "https://6057e432c3f49200173ad08d.mockapi.io/api/v1/employees/" + id,
      true
    );
    request.send();
  } else {
    alert(
      'Please, if you want edit an employee, close the "add window" first with the cancel button'
    );
  }
}

// Event click of button add for showing the modal add employee operation
ADDBTN.addEventListener("click", showhideModal);
BURGERADDBTN.addEventListener("click", showhideModal);
// Event click of button cancel in modal add employee operation
CANCELBTN.addEventListener("click", showhideModal);

/* Show or Hide the adding/editing modal logic */
function showhideModal() {
  // CLear field form
  clearFormData();

  // Reset id to false
  editFormEmployee = false;

  // Modal display logic
  if (MODAL.style.display === "none") {
    MODAL.style.display = "block";
  } else {
    MODAL.style.display = "none";
  }
}

/* Burger Menu Show Hide Logic */
BURGERBTN.addEventListener("click", showhideBurgerMenu);
CLOSEBTN.addEventListener("click", showhideBurgerMenu);
// Verification if menu burger is open or not with click event on burger button or close button
function showhideBurgerMenu() {
  if (BURGERMENU.style.display === "none") {
    BURGERMENU.style.display = "flex";
    BURGERBTN.style.display = "none";
    CLOSEBTN.style.display = "block";
  } else {
    BURGERMENU.style.display = "none";
    BURGERBTN.style.display = "block";
    CLOSEBTN.style.display = "none";
  }
}

// Verification if burger menu is displayed or not (for the addEmployee() function)
function burgerMenuOpenVerif() {
  if (BURGERMENU.style.display != "none") {
    showhideBurgerMenu();
  }
}

// Event click of button submit for submit the form field datas
SUBMITBTN.addEventListener("click", submitForm);

/* Checking form values when the user clicks on submit button */
function submitForm() {
  // Regex const declaration
  const REGEXTEXT = /^([A-Za-zÀ-ÖØ-öø-ÿ ,.'-])+$/;
  const REGEXJOB = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s_\-\']+$/;
  const REGEXEMAIL =
    /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/;
  // Variable declaration
  let nameFormField = document.getElementById("name").value;
  let lastnameFormField = document.getElementById("last_name").value;
  let jobtitleFormField = document.getElementById("job_title").value;
  let emailFormField = document.getElementById("email").value;
  let formFields =
    nameFormField && lastnameFormField && jobtitleFormField && emailFormField;

  // Check the form fields if there are no empty ones
  if (formFields != (null || "")) {
    // Field values verification with Regex
    if (REGEXTEXT.test(nameFormField) === false) {
      alert("Please enter a correct name");
    } else if (REGEXTEXT.test(lastnameFormField) === false) {
      alert("Please enter a correct firstname");
    } else if (REGEXJOB.test(jobtitleFormField) === false) {
      alert("Please enter a correct jobtitle");
    } else if (REGEXEMAIL.test(emailFormField) === false) {
      alert("Please enter a correct email");
    } else {
      // Submit all values
      if (!editFormEmployee) {
        addEmployee();
      } else {
        editEmployee();
      }
    }
  } else {
    alert("Please complete all fields");
  }
}

/* Add an Employee logic */
function addEmployee() {
  let employeeValue = getFormData();
  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 201) {
      stringifyValues = JSON.stringify(employeeValue);
      console.log(stringifyValues);
      // Reset form field
      clearFormData();
      // Hide modal
      showhideModal();
      // Verification if burger menu is open or not, if not do nothing
      burgerMenuOpenVerif();
      // Confirm to the user the operation was successfuly
      alert("The employee has been added");
      // Refresh data table
      getData();
    }
  };
  request.open(
    "POST",
    "https://6057e432c3f49200173ad08d.mockapi.io/api/v1/employees"
  );
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  request.send(
    "name=" +
      document.getElementById("name").value +
      "&" +
      "last_name=" +
      document.getElementById("last_name").value +
      "&" +
      "job_title=" +
      document.getElementById("job_title").value +
      "&" +
      "email=" +
      document.getElementById("email").value
  );
}

/* Edit an Employee logic */
function editEmployee() {
  let request = new XMLHttpRequest();
  let employeeValue = getFormData();
  console.log(editFormEmployee.id);
  employeeValue["id"] = editFormEmployee.id;
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      editFormEmployee = null;
      // Reset form field
      clearFormData();
      // Hide modal
      showhideModal();
      // Confirm to the user the operation was successfuly
      alert("The employee has been edited");
      // Refresh data table
      getData();
    }
  };
  request.open(
    "PUT",
    "https://6057e432c3f49200173ad08d.mockapi.io/api/v1/employees/" +
      employeeValue["id"]
  );
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  // Send values of form
  request.send(
    "name=" +
      document.getElementById("name").value +
      "&" +
      "last_name=" +
      document.getElementById("last_name").value +
      "&" +
      "job_title=" +
      document.getElementById("job_title").value +
      "&" +
      "email=" +
      document.getElementById("email").value
  );
}

/* Delete an Employee logic */
function deleteData(id) {
  // Verification if modal is open or not. If yes, spawn alert to user.
  if (MODAL.style.display !== "block") {
    const DELETECONFIRM = window.confirm(
      "Are you sure ? This action is irreversible"
    );
    if (DELETECONFIRM === true) {
      let request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          // Confirm to the user the operation was successfuly
          alert("The employee has been deleted");
          // Refresh Data table
          getData();
        }
      };
      request.open(
        "DELETE",
        "https://6057e432c3f49200173ad08d.mockapi.io/api/v1/employees/" + id
      );
      request.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
      );
      request.send();
    } else {
      alert("Operation canceled");
    }
  } else {
    alert(
      'Please, if you want delete an employee, close the "add window" first with the cancel button'
    );
  }
}

/* Data acquisition logic */
function getData() {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      parsedValues = JSON.parse(this.responseText);
      console.log(parsedValues);
      // Put Data into HTML table, creating each table row based on API datas return
      let dataValues = "";
      parsedValues.forEach((values) => {
        dataValues += "<tr>";
        dataValues += "<td>" + values.id + "</td>";
        dataValues += "<td>" + values.name + "</td>";
        dataValues += "<td>" + values.last_name + "</td>";
        dataValues += "<td>" + values.job_title + "</td>";
        dataValues += "<td>" + values.email + "</td>";
        dataValues +=
          "<td><button onclick='editDataCall(`" +
          values.id +
          "`)'>Edit</button></td>";
        dataValues +=
          "<td><button onclick='deleteData(`" +
          values.id +
          "`)'>Delete</button></td>";

        dataValues += "</tr>";
      });
      // Add table into HTML page
      document.getElementById("dataValues").innerHTML = dataValues;
    }
  };
  request.open(
    "GET",
    "https://6057e432c3f49200173ad08d.mockapi.io/api/v1/employees",
    true
  );
  request.send();
}
