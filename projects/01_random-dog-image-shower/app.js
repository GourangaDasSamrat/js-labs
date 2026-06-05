import axios from "axios/dist/esm/axios.min.js";

async function getDogImage() {
  try {
    const apiUrl = "https://dog.ceo/api/breeds/image/random";
    const imageData = await axios.get(apiUrl);
    const image = imageData.data.message;
    const imageElement = document.querySelector(".card-img-top");

    if (imageElement) {
      imageElement.setAttribute("src", image);
    }
  } catch (error) {
    console.error("Error fetching dog image:", error);
  }
}

window.getDogImage = getDogImage;

getDogImage();
