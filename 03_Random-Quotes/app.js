import axios from "./node_modules/axios/dist/esm/axios.min.js";

async function getQuote() {
  try {
    const apiUrl = "https://api.kanye.rest/";
    const response = await axios.get(apiUrl);

    const quote = response.data.quote;

    const quoteBox = document.getElementById("quote");

    quoteBox.innerText = `"${quote}"`;
  } catch (error) {
    console.error("Error fetching quote:", error);
  }
}

window.getQuote = getQuote;

getQuote();
