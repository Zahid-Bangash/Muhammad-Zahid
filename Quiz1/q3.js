// a)
console.log(1 + "2" + "2");

//  Output: 122
//  number will concatenate with strings
 
// b) 
console.log(1 + +"2" + "2");

// Output: 32
// Here we have two + ,,,,,,,,one is used in concatenation of 1 and +2 and after concatenation + operatio is performed on 1 and 2.


// c) 
console.log(1 + -"2" + "2");

// Output: -12
// Here we have one + and one -,,,First + is used in concatenation of 1 and -2 after concatenation - operation is performed on 1 and 2

// d)
 console.log( "A" - "B" + "2");

// Output: NaN2
// We can't subtract strings from one nother.

// e) 
console.log( "A" - "B" + 2);

// Output: NaN
// We can't subtract strings from one another.