//problem 3
let library = [
  {
    author: "Bill Gates",
    title: "The Road Ahead",
    readingStatus: true,
  },
  {
    author: "Steve Jobs",
    title: "Walter Isaacson",
    readingStatus: true,
  },
  {
    author: "Suzanne Collins",
    title: "Mockingjay: The Final Book of The Hunger Games",
    readingStatus: false,
  },
];

for (let i = 0; i < library.length; i++) {
  console.log("Book number:" + (i + 1));
  console.log(
    "Author name:" +
      library[i].author +
      "\n" +
      "Book name:" +
      library[i].title +
      "\n" +
      "Reading status:" +
      library[i].readingStatus
  );
}
