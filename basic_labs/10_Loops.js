let fruits = ["Banana", "Mango", "Kiwi", "Lemon", "Orange", "Lichi"];

let country = [
  ["Bangladesh", "Dhaka"],
  ["USA", "Washington DC"],
  ["UK", "London"],
  ["Mexico", "Mexico City"],
];

let president = {
  Name: "Donald Trump",
  country: "United States of America",
  age: "79",
};

// for loop
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}

// for of loop
for (Element of fruits) {
  console.log(Element);
}

// for in loop
for (el in president) {
  console.log(el);
}

// nested loop
for (let i = 0; i < country.length; i++) {
  for (let j = 0; j < country[i].length; j++) {
    console.log(country[i][j]);
  }
}

// while loop

let i = 0;
while (i < fruits.length) {
  console.log(fruits[i]);
  i++;
}
