/*
// Array can't break sequence

let arr = [2, 4, 5, 67];
arr[10] = 30;
console.log(arr);

// check array length
console.log(arr.length);

// 2d array
let Arr = [
  ["Messi", "Ronaldo", "Neymar"],
  "NEw York",
  "Chili",
  "USA",
  "Soudi Arabia",
];

console.log(Arr);
console.log(Arr[0][2]);
* */

// Array methods

/**
// Array length
let fruits = ["Banana", "Orange", "Apple", "Mango"];
let size = fruits.length;
console.log(size);
 */

// Array toString()
/**
let fruits = ["Banana", "Orange", "Apple", "Mango"];
let myList = fruits.toString();
console.log(myList);
**/

/**
// Array at()
let fruits = ["Banana", "Orange", "Apple", "Mango"];
let fruit = fruits.at(2);
console.log(fruit)

// without method
let fruits = ["Banana", "Orange", "Apple", "Mango"];
let fruit = fruits[2];
 */

// Array pop()
/*
let fruits = ["Banana", "Orange", "Apple", "Mango"];
let fruit = fruits.pop();
console.log(fruits);
*/

// Array push
/*
let fruits = ["Banana", "Orange", "Apple", "Mango"];
let fruit = fruits.push("Kiwi");
console.log(fruits);
*/

// Array shift()
/*
let fruits = ["Banana", "Orange", "Apple", "Mango"];
let fruit = fruits.shift();
console.log(fruits);
*/

// Array unshift()
/*
let fruits = ["Banana", "Orange", "Apple", "Mango"];
fruits.unshift("Lemon");
console.log(fruits);
*/

// Array delete()
/*
let fruits = ["Banana", "Orange", "Apple", "Mango"];
let fruit = delete fruits[0];
console.log(fruits);
*/

// Array concat()
/*
const myGirls = ["Cecilie", "Lone"];
const myBoys = ["Emil", "Tobias", "Linus"];
const myStudents = ["Trump", "Biden", "Michel"];

const myChildren = myGirls.concat(myBoys).concat(myStudents);
console.log(myChildren);

// add a value
const arr1 = ["Emil", "Tobias", "Linus"];
const myChildren = arr1.concat("Peter");
console.log(myChildren);

*/

// Array copyWithin()
/*
let fruits = ["Banana", "Orange", "Apple", "Mango", "Kiwi"];
let fruit =fruits.copyWithin(2, 0, 2);
console.log(fruits);
*/

// Array flat()
/*
const myArr = [
  [1, 2],
  [3, 4],
  [5, 6],
];
const newArr = myArr.flat();

console.log(newArr);
*/

// Array flatMap()
/*
const myArr = [1, 2, 3, 4, 5, 6];
const newArr = myArr.flatMap((x) => [x, x * 10]);
console.log(newArr);
*/

// Array splice()
/*
// remove item
let fruits = ["Banana", "Orange", "Apple", "Mango"];
let fruit = fruits.splice(2, 0);
console.log(fruits);

// replace item
let fruits = ["Banana", "Orange", "Apple", "Mango"];
let fruit = fruits.splice(2, 0, "Lemon", "Kiwi");
console.log(fruits);

*/

// Array slice()
/*
const fruits = ["Banana", "Orange", "Lemon", "Apple", "Mango"];
const citrus = fruits.slice(3);
console.log(citrus);
*/

// Array toSpliced()
/*
const months = ["Jan", "Feb", "Mar", "Apr"];
const spliced = months.toSpliced(0, 1);

console.log(spliced);
*/
