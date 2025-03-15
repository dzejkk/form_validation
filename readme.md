# Cloned to local Environment

## Get data from form manually

<code>
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
      formData["consent"] = inputField.checked; // This will store true or false
    } else {
      formData[input] = inputField.value;
    }

});

console.log(formData);
return formData;
}
</code>
