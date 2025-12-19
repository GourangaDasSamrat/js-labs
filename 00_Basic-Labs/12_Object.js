let president = {
  Name: "Donald Trump",
  country: "United States of America",
  age: "79",
  edu: {
    uni: {
      uni1: "Wharton School of the University of Pennsylvania",
      uni2: "New York Military Academy",
      uni3: "Fordham University",
    },
    scl: "The Kew-Forest School",
  },
};

// Access property
console.log(president.Name);
console.log(president.edu.scl);
console.log(president.edu.uni.uni2);

let me = {
  firstName: "Gouranga",
  lastName: "Das",
  age: 17,
  greet() {
    return `Hello, my name is ${this.firstName} ${this.lastName}. And I'm ${this.age} years old.`;
  },
};

// access method
console.log(me.greet());
