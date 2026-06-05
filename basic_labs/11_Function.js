let a = 20;
let b = 30;

// addition function
function add(x, y) {
  let z = x + y;
  console.log(z);
}

// subtraction function
function sub(x, y) {
  let z = x - y;
  console.log(z);
}

// multiplication function (using arrow function)
let mul = (x, y) => {
  let z = x * y;
  console.log(z);
};

// division function (using arrow function)
let div = (x, y) => {
  let z = x / y;
  console.log(z);
};

// call function with arguments
add(a, b);
sub(a, b);
mul(a, b);
div(a, b);

// Accidental Global Scope
function acg() {
  fullName = "Gouranga";
}

acg();
console.log(fullName); // Access fullName Globally