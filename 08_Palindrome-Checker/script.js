document.addEventListener("DOMContentLoaded", () => {
  const textInput = document.getElementById("text-input");
  const checkButton = document.getElementById("check-btn");
  const result = document.getElementById("result");

  const isPalindrome = (str) => {
    // Keep original input for display
    const original = str;

    // Convert to lowercase and remove all non-alphanumeric characters
    str = str.toLowerCase().replace(/[\W_]/g, "");

    // Compare the string with its reverse
    const reversed = str.split("").reverse().join("");

    // Return true if palindrome, false otherwise
    return {
      isPalindrome: str === reversed,
      original: original,
    };
  };

  const checkPalindrome = () => {
    // Get the input value
    const input = textInput.value;

    // Check if input is empty
    if (!input) {
      alert("Please input a value");
      return;
    }

    // Check if it's a palindrome
    const { isPalindrome: palindrome, original } = isPalindrome(input);

    // Display the result
    result.textContent = `${original} is ${
      palindrome ? "" : "not "
    }a palindrome`;
  };

  // Add click event listener to the check button
  checkButton.addEventListener("click", checkPalindrome);

  // Add enter key event listener to the input field
  textInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      checkPalindrome();
    }
  });
});
