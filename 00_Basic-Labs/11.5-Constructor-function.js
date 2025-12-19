class MyPhones {
  constructor(brand, model, price) {
    this.brand = brand;
    this.phoneModel = model;
    this.price = price;
  }
}

let phone1 = new MyPhones("Apple", "17 Pro Max", "123000");
let phone2 = new MyPhones("Apple", "13 Pro", "34000");

console.log(phone1);
console.log(phone2);
