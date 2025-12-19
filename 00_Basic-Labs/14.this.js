let president = {
  Name: "Donald Trump",
  country: "United States of America",
  age: "79",

  details: function () {
    console.log(
      `Mr ${this.Name} is the president of ${this.country}. He is ${this.age} years old.`
    );
  },
};

let presidents = {
  names: [
    "Donald Trump",
    "Joe Biden",
    "Barack Obama",
    "George W. Bush",
    "Bill Clinton",
    "George H. W. Bush",
  ],
  title: "is the President of United States of America",

  details: function () {
    this.names.forEach(function (i) {
      console.log(`Mr. ${i} ${this.title}`);
    }, this);
  },
};

let presidents2 = {
  names: [
    "Donald Trump",
    "Joe Biden",
    "Barack Obama",
    "George W. Bush",
    "Bill Clinton",
    "George H. W. Bush",
  ],
  title: "is the President of United States of America",

  details() {
    this.names.forEach((i) => {
      console.log(`Mr. ${i} ${this.title}`);
    });
  },
};

president.details();
presidents.details();
presidents2.details();

// method -> object
// function -> global object/window object
