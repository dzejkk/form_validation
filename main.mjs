import emailjs from "@emailjs/browser";

emailjs.init(import.meta.env.VITE_EMAIL_USER_ID);
console.log("Initialized with User ID:", import.meta.env.VITE_EMAIL_USER_ID);

///////////////////////* MOST SIMPLE APROACH USING CONSTRAINS API *///////////////

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

//////////////* EXPANDED VERSION TO WHOLE FORM *////////////////////////////

const Form = document.getElementById("form");

const inputFields = {
  name: document.getElementById("name"),
  lastName: document.getElementById("last-name"),
  email: document.getElementById("email"),
  radio: document.querySelectorAll('input[name="radio-general-enquiry"]'), // Handle multiple radio buttons
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

// Function to find the associated error element dynamically
function getErrorElement(input) {
  if (input.name === "options") {
    return document.getElementById("radio-error");
  }
  const container = input.closest(
    "div, .radio-wrap, .text-area-wrap, fieldset"
  );
  return container ? container.querySelector(".error") : null;
}

// show error functio
function showError(field) {
  const input = inputFields[field]; // finds input
  const errorElement =
    field === "radio"
      ? document.getElementById("radio-error") // Use the specific container
      : getErrorElement(input);

  if (!errorElement) return;

  if (field === "radio") {
    const isChecked = Array.from(input).some((radio) => radio.checked);
    if (isChecked) {
      errorElement.textContent = "";
      errorElement.className = "error";
      return;
    }
    errorElement.textContent = validationMessages[field].required;
    errorElement.className = "error active";
    return;
  }

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

  if (field === "radio") {
    input.forEach((radio) => {
      radio.addEventListener("change", () => {
        showError(field);
      });
    });
  } else {
    input.addEventListener("input", () => {
      showError(field);
    });
  }
});

//MARK:// SEND EMAIL  //

Form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("form submited");
  let hasError = false;

  Object.keys(inputFields).forEach((field) => {
    if (field === "radio") {
      const isChecked = Array.from(inputFields[field]).some(
        (radio) => radio.checked
      );
      if (!isChecked) {
        hasError = true;
        showError(field);
      }
    } else if (!inputFields[field].validity.valid) {
      hasError = true;
      showError(field);
    }
  });
  if (hasError) {
  } else {
    const data = collectData();
    console.log("Sending email with:", data);

    emailjs
      .send(
        import.meta.env.VITE_EMAIL_SERVICE_ID,
        import.meta.env.VITE_EMAIL_TEMPLATE_ID,
        data
      )
      .then(() => console.log("Email sent!"))
      .catch((error) => console.error("Error:", error));
  }
});

// cCOLECT DATA //

function collectData() {
  let formData = {};
  Object.keys(inputFields).forEach((input) => {
    const inputField = inputFields[input];
    if (input === "radio") {
      let radioCheck = Array.from(inputField);
      const filtered = radioCheck.find((item) => item.checked === true);
      if (filtered) {
        formData["radio"] = filtered.value;
      }
    } else if (input === "checkBox") {
      formData["consent"] = inputField.checked;
    } else {
      formData[input] = inputField.value;
    }
  });
  console.log("Collected data:", formData);
  return formData;
}
