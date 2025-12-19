function add(...array) {
  let result = 0;

  for (i = 0; i < array.length; i++) {
    result += array[i];
  }

  return result;
}

let array2 = [3, 54, 6, 7, 8, 3, 2, 5];

console.log(add(...array2));