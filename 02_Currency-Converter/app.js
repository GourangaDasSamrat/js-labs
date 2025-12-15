import axios from "./node_modules/axios/dist/esm/axios.min.js";

async function convertCurrency() {
  const inputAmount = parseFloat(document.getElementById("input").value);
  const inputCurrency = document.getElementById("inputCur").value;
  const outputCurrency = document.getElementById("outputCur").value;

  if (
    !inputAmount ||
    inputCurrency === "disabled" ||
    outputCurrency === "disabled"
  ) {
    alert("Please fill out all fields");
    return;
  }

  try {
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/${inputCurrency}`;
    const response = await axios.get(apiUrl);

    const rate = response.data.rates[outputCurrency.toUpperCase()];

    if (!rate) {
      throw new Error("Conversion rate not available");
    }

    const convertedAmount = inputAmount * rate;

    document.getElementById(
      "resultAmount"
    ).textContent = `${convertedAmount.toFixed(
      2
    )} ${outputCurrency.toUpperCase()}`;
    document.getElementById("result").style.display = "block";
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    alert("There was an error with the currency conversion. Please try again.");
  }
}

window.convertCurrency = convertCurrency;
