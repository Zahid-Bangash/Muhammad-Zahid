//problem 2

let student = {
    name: "Zahid Banagash",
    registration: "FA19-BCS-011",
    department: "CS",
    semester: 5,
    section: "6A",
  };
  
console.log(student);       //before deleting registration property
delete student.registration;
console.log(student);       //after deleting registration property
