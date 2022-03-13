let myArray = ["a", "b", "c", "d,e,f", "a,b,c"];
let uniqueArray = Array.from(new Set(myArray));
// let uniqueArray=myArray.filter((item,i,ar)=>ar.indexOf(item)==i);
console.log(uniqueArray);
