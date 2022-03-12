//problem 1
let student = {
  name: "Zahid Banagash",
  registration: "FA19-BCS-011",
  department: "CS",
  semester: 5,
  section: "6A",
};

console.log('listing through for in loop');         //listing through for in loop
for (let key in student) {              
  console.log(key, student[key]);
}


console.log('listing through dot operator'); 
console.log(student.name + "\n" + student.registration);        //listing through dot operator

console.log('listing through bracket operator'); 
console.log(student["name"] + "\n" + student["registration"]);      //listing through bracket operator
