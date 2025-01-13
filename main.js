///////////////////////* MOST SIMPLE APROACH USING CONSTRAINS API */

/*

const form = document.querySelector("form");
const email = document.getElementById("email");
const emailError = document.querySelector("#email + span.error");

email.addEventListener("input", (event) => {
  if (email.validity.valid) {
    emailError.textContent = ""; // Remove the message content
    emailError.className = "error"; // Removes the `active` class
  } else {
    // If there is still an error, show the correct error
    showError();
  }
});

form.addEventListener("submit", (event) => {
  // if the email field is invalid
  if (!email.validity.valid) {
    // display an appropriate error message
    showError();
    // prevent form submission
    event.preventDefault();
  }
});

function showError() {
  if (email.validity.valueMissing) {
    // If empty
    emailError.textContent = "You need to enter an email address.";
  } else if (email.validity.typeMismatch) {
    // If it's not an email address,
    emailError.textContent = "Entered value needs to be an email address.";
  } else if (email.validity.tooShort) {
    // If the value is too short,
    emailError.textContent = `Email should be at least ${email.minLength} characters; you entered ${email.value.length}.`;
  }
  // Add the `active` class
  emailError.className = "error active";
}

*/

//////////////* EXPANDED VERSION TO WHOLE FORM */

const Form = document.getElementById("form");

const inputFields = {
  name: document.getElementById("name"),
  lastName: document.getElementById("last-name"),
  email: document.getElementById("email"),
  radio: document.getElementById("radio-btn"), //  pozor viac elementov
  textArea: document.getElementById("text-area"),
  checkBox: document.getElementById("check-box"),
};

const validationMessages = {
  name: {
    required: "Please enter your name",
    short: "Name must be at least 2 characters",
  },
  lastName: {
    required: "Please enter your last name",
    short: "Last name must be at least 3 characters",
  },
  email: {
    required: "Email is required",
    invalid: "Please enter a valid email",
  },
  radio: {
    required: "Option is mandatory",
    invalid: "Please select an option",
  },
  textArea: {
    required: "Please provide us feedback",
    invalid: "Feedback must be at least 30 characters",
  },
  checkBox: {
    required: "Please agree to the terms and conditions",
    invalid: "Please check this box",
  },
};

function showError(field) {
  const input = inputFields[field];
  const errorElement = input.nextElementSibling; // nahradit custom

  if (input.validity.valid) {
    errorElement.textContent = "";
    errorElement.className = "error";
    return;
  }

  if (input.validity.valueMissing) {
    errorElement.textContent = validationMessages[field].required;
  } else if (input.validity.tooShort || input.validity.typeMismatch) {
    errorElement.textContent =
      validationMessages[field].short || validationMessages[field].invalid;
  }

  errorElement.className = "error active";
}

// Adding input event listeners
Object.keys(inputFields).forEach((field) => {
  const input = inputFields[field];
  input.addEventListener("input", () => {
    showError(field);
  });
});

// Handle form submit
Form.addEventListener("submit", (e) => {
  let hasError = false;

  // Check all fields
  Object.keys(inputFields).forEach((field) => {
    if (!inputFields[field].validity.valid) {
      hasError = true;
      showError(field);
    }
  });

  // If there are errors, prevent form submission
  if (hasError) {
    e.preventDefault();
  }
});
