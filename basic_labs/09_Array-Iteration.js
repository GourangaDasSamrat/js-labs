let fruits = ["Banana", "Orange", "Apple", "Mango", "Kiwi", "Lemon"];

// for loop
/*
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}
*/

// for each
fruits.forEach(function (item,index,array) {
console.log(item,index,array);
})