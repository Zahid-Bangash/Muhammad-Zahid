//problem 4

// let sandwichCalculator = (breads) => {
//   possibleSandwiches = breads / 2;
//   return "Possible no of Sandwiches = " + possibleSandwiches;
// };

// console.log(sandwichCalculator(10));

//Extended function

let sandwichCalculator = (breads, cheese) => {
  let possibleSandwiches, message, remains, item;
  if (breads / 2 < cheese) {
    possibleSandwiches = breads / 2;
    remains = cheese - breads / 2;
    item = "Cheese remains:";
    message = "Shortage of breads";
  }
  if (breads / 2 > cheese) {
    possibleSandwiches = cheese;
    remains = breads / 2 - cheese;
    message = "Shortage of cheese";
    item = "Breads remains:";
  }
  if (breads / 2 === cheese) {
    possibleSandwiches = cheese;
    remains = 0;
    message = "No shortage";
    item = "Nothing remains:";
  }
  return (
    "Breads=" +
    breads +
    "  and  " +
    "Cheese=" +
    cheese +
    "\n" +
    "Possible no of sandwiches=" +
    possibleSandwiches +
    "\n" +
    message +
    "\n" +
    item +
    remains
  );
};

console.log(sandwichCalculator(20, 20));
