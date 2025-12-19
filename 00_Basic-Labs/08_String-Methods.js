// String length
/*
let text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let length = text.length;

console.log(length);

// output -> 26
*/

// String charAt()
/*
let text = "HELLO WORLD";
let char = text.charAt(0);

console.log(char);

// output -> H
*/

// String charCodeAt()
/*
let text = "HELLO WORLD";
let char = text.charCodeAt(0);

console.log(char);

// output -> 72
*/

// charPointAt()
/*
let text = "HELLO WORLD";
let code = text.codePointAt(0);

console.log(code);

// output -> 72
*/

// String at()
/*
const brand = "W3Schools";
let letter = brand.at(2);

console.log(letter);

// output -> S

// without method

const brand = "W3Schools";
let letter = brand[2];

console.log(letter);
// output -> S
*/

// String concat()
/*
let text1 = "Hello";
let text2 = "World";
let text3 = "Programmers";

let text4 = text1.concat(" ", text2).concat(" ", text3, "😁️");

console.log(text4);

// output -> Hello World Programmers😁️
*/

// String slice()
/*
let text = "Apple, Banana, Kiwi, Lemon";
let part = text.slice(7, 13);

console.log(part);

// output -> Banana
*/

// String substring()
/*
let str = "Apple, Banana, Kiwi";
let part = str.substring(7, 13);

console.log(part);

// output -> Banana
*/

// String toUpperCase()
/*
let text1 = "Hello World!";
let text2 = text1.toUpperCase();

console.log(text2);

// output -> HELLO WORLD!
*/

// String toLowerCase()
/*
let text1 = "Hello World!";
let text2 = text1.toLowerCase();

console.log(text2);

// output -> hello world!
*/

// String isWellFormed()
/*

// well formed
let text = "Hello world!";
let result = text.isWellFormed();

console.log(result);

// output -> true

// not well formed

let text = "Hello World \uD800";
let result = text.isWellFormed();

console.log(result);

// output -> false
*/

// toWellFormed()
/*
let text = "Hello World \uD800";
let result = text.toWellFormed();

console.log(result);

// output -> Hello World �
*/

// String trim()
/*
let text1 = "      Hello World!      ";
let text2 = text1.trim();

console.log(text2);

// output -> Hello World!
*/

// String trimStart()
/*
let text1 = "     Hello World!     ";
let text2 = text1.trimStart();

console.log(text2);

// output -> Hello World!
*/

// String trimEnd()
/*
let text1 = "     Hello World!     ";
let text2 = text1.trimEnd();

console.log(text2);

// output ->      Hello World!
*/

// String repeat()
/*
let text = "Hello world!";
let result = text.repeat(4);

console.log(result);

// output -> Hello world!Hello world!Hello world!Hello world!
*/

// String replace()
/*
let text = "Please visit Microsoft and Microsoft!";
let newText = text.replace("Microsoft", "W3Schools");

console.log(newText);

// output -> Please visit W3Schools and Microsoft!
*/
