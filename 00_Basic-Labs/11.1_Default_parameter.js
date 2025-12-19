// with default parameter
function withDefVal(a = 10, b = 12) {
  console.log(a + b);
}

// without default parameter
function outDefVal(a, b) {
  console.log(a + b);
}

// invoke functions
withDefVal();
withDefVal(90, 29);

outDefVal();
outDefVal(29, 12);
