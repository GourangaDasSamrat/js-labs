function myPhones(brand, model, price) {
  return {
    brand,
    phoneModel: model,
    price,
  };
}

let phone1 = myPhones("Apple", "17 Pro Max", "230000");
let phone2 = myPhones("Samsung", "S25 Ultra", "240000");
let phone3 = myPhones("Nokia", "150", "30000");

console.log(phone1);
console.log(phone2);
console.log(phone3);
