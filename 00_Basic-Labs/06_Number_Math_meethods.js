// Number methods
let a = 12.40959;
let b = 12.50959;

console.log(typeof a.toString());
console.log(a.toExponential(4));
console.log(a.toFixed());
console.log(a.toFixed(2));

// Math methods
console.log(Math.round(a));
console.log(Math.round(b));
console.log(Math.ceil(a));
console.log(Math.floor(a));
console.log(Math.pow(a, b));
// Math.random
console.log(Math.random());
console.log(Math.random() * 100); //value between 0 to 100
console.log(Math.round(Math.random() * 100)); //value between 0 to 100 as a round figure
console.log(Math.pow(Math.random() * 20, Math.random() * 20));
// Math.max and Math.min
console.log(Math.max(a, b));
console.log(Math.min(a, b));
// Trigonometry
console.log(Math.sign(0));
console.log(Math.cos(0));
console.log(Math.tanh(45));