const classNames = {
  TODO_ITEM: "todo-container",
  TODO_CHECKBOX: "todo-checkbox",
  TODO_TEXT: "todo-text",
  TODO_DELETE: "todo-delete",
};

const list = document.getElementById("todo-list");
const itemCountSpan = document.getElementById("item-count");
const uncheckedCountSpan = document.getElementById("unchecked-count");


itemCount = 0;
uncheckedCount = itemCount;

function newTodo() {
  /*Add Logic for creating a new Todo Item. */

  /*Below lines can be used to update the data on frontend */
  let li = document.createElement("li");
  let text = window.prompt('Enter todo item');
  if (text === '') {
    alert('Enter something');
  }
  else {
    li.appendChild(document.createTextNode(text));
    list.append(li);

    itemCount += 1;
    uncheckedCount += 1;

    itemCountSpan.innerHTML = itemCount;
    uncheckedCountSpan.innerHTML = uncheckedCount;
  }
}

//Add checkbox property
let ul = document.querySelector('ul');
ul.addEventListener('click', function (ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
    uncheckedCount -= 1;
    uncheckedCountSpan.innerHTML = uncheckedCount;
  }
}, false);

function removeTodo() {
  /*Add Logic for removing an existing TODO Item */
  /*Below lines can be used to update the data on frontend */
  if (confirm('Do want to delete items?')) {
    let text = window.prompt('Enter the item to delete');
    let li = document.querySelectorAll('ul li');

    for (let i = 0; i < li.length; i++) {

      if (li[i].textContent === text) {
        li[i].remove();
        itemCount -= 1;
        uncheckedCount -= 1;
        itemCountSpan.innerHTML = itemCount;
        uncheckedCountSpan.innerHTML = uncheckedCount;
      }
    }

    // list.innerHTML = " ";
    // itemCountSpan.innerHTML = "0";
    // uncheckedCountSpan.innerHTML = "0";
  }
}