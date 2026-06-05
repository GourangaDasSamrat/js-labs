document.addEventListener("DOMContentLoaded", () => {
  const userInput = document.getElementById("user-input");
  const checkBtn = document.getElementById("check-btn");
  const clearBtn = document.getElementById("clear-btn");
  const resultsDiv = document.getElementById("results-div");

  // Function to validate the phone number
  function validatePhoneNumber(number) {
    // Remove any whitespace from the beginning and end
    number = number.trim();

    // Regular expression to match valid US phone number formats
    const phoneRegex = /^(1\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/;

    return phoneRegex.test(number);
  }

  // Function to display the result
  function displayResult(number, isValid) {
    const status = isValid ? "Valid" : "Invalid";
    resultsDiv.textContent = `${status} US number: ${number}`;
    resultsDiv.className = isValid ? "valid" : "invalid";
  }

  // Event listener for the check button
  checkBtn.addEventListener("click", () => {
    const phoneNumber = userInput.value;

    if (!phoneNumber) {
      alert("Please provide a phone number");
      return;
    }

    const isValid = validatePhoneNumber(phoneNumber);
    displayResult(phoneNumber, isValid);
  });

  // Event listener for the clear button
  clearBtn.addEventListener("click", () => {
    resultsDiv.textContent = "";
    resultsDiv.className = "";
    userInput.value = "";
  });

  // Event listener for the Enter key
  userInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      checkBtn.click();
    }
  });
});
