const myLibrary = {};

const boards = document.querySelector(".boards");
const newBoardDialog = document.querySelector("#new-board");
const newBookDialog = document.querySelector("#new-book");

let currentParent = null;
let currentOpen = null;
let currentForm = null;

function Book(form) {
  this.title = form.get("book-title");
  this.author = form.get("book-author");
  this.numberOfPages = form.get("book-number-of-pages");
  this.status = form.get("book-status");
  this.id = crypto.randomUUID();
}

Book.prototype.toggleStatus = function () {
  this.status = this.status === 'Read' ? 'Not read' : 'Read';
}

function Board(form) {
  this.title = form.get("board-title");
}

function addBookToBoard(book, board) {
  board.push(book);
}

function clearDisplay() {
  while (boards.firstChild) {
    boards.removeChild(boards.firstChild);
  }
}

function closeAllBoards() {
  Array.from(boards.children).forEach((board) => {
    board.classList.remove("open");
  });
}

function closeDialog() {
  newBoardDialog.close();
  newBookDialog.close();
  currentParent = null;
  currentForm = null;
}

function openBoard(target) {

  if (!target.classList.contains("open")) {
    closeAllBoards();
    target.classList.add("open");
    currentOpen = `${target.dataset.board}`;
  } else {
    target.classList.remove("open");
  }
}

function createEmptyMessage() {
  const emptyMessage = document.createElement("div");
  emptyMessage.classList.add("empty-message");

  const emptyMessageText = document.createElement("p");
  emptyMessageText.textContent = `It's time to Read something...`;
  emptyMessage.appendChild(emptyMessageText);

  return emptyMessage;
}

function showEmptyMessage() {
  if (!document.querySelector(".board")) {
    createEmptyMessage();
  }
}

function renderBook(book) {
  const bookCard = document.createElement("div");
  bookCard.classList.add("book");
  bookCard.dataset.id = book.id;

  const bookTitle = document.createElement("h3");
  bookTitle.textContent = book.title;
  bookCard.appendChild(bookTitle);

  const removeBookBtn = document.createElement("button");
  removeBookBtn.classList.add("remove", "btn");
  removeBookBtn.textContent = "Remove book";
  bookCard.appendChild(removeBookBtn);

  const changeStatusBtn = document.createElement("button");
  changeStatusBtn.classList.add("toggle", "btn");
  changeStatusBtn.textContent = "Change status";
  bookCard.appendChild(changeStatusBtn);

  const description = document.createElement("div");
  description.classList.add("description");
  bookCard.appendChild(description);

  const authorText = document.createElement("p");
  authorText.textContent = `Author: ${book.author}`;
  description.appendChild(authorText);

  const pagesText = document.createElement("p");
  pagesText.textContent = `Pages: ${book.numberOfPages}`;
  description.appendChild(pagesText);

  const statusText = document.createElement("p");
  statusText.textContent = `Status: ${book.status}`;
  description.appendChild(statusText);

  return bookCard;
}

function renderBoard(library) {
  clearDisplay();

  Object.values(library).forEach((board, i) => {
    const boardBlock = document.createElement("div");
    boardBlock.classList.add("board");
    boardBlock.dataset.board = `${Object.keys(library)[i]}`;
    if (currentOpen === `${Object.keys(library)[i]}`) {
      boardBlock.classList.add("board", "open");
    } else {
      boardBlock.classList.add("board");
    }

    const boardTitle = document.createElement("h2");
    boardTitle.textContent = Object.keys(library)[i];
    boardBlock.appendChild(boardTitle);

    const actionBlock = document.createElement("div");
    actionBlock.classList.add("board-action");
    boardBlock.appendChild(actionBlock);

    const newBookBtn = document.createElement("button");
    newBookBtn.classList.add("btn", "new-book-btn");
    newBookBtn.textContent = "Add new book";
    newBookBtn.dataset.parent = `${Object.keys(library)[i]}`;
    actionBlock.appendChild(newBookBtn);

    const removeBoardBtn = document.createElement("button");
    removeBoardBtn.classList.add("btn", "remove-board");
    removeBoardBtn.textContent = "Remove board";
    removeBoardBtn.dataset.board = `${Object.keys(library)[i]}`;
    actionBlock.appendChild(removeBoardBtn);

    const openBoardBtn = document.createElement("button");
    openBoardBtn.classList.add("open-board");
    boardBlock.appendChild(openBoardBtn);

    const openBoardSpan1 = document.createElement("span");
    openBoardBtn.appendChild(openBoardSpan1);
    const openBoardSpan2 = document.createElement("span");
    openBoardBtn.appendChild(openBoardSpan2);
    const openBoardSpan3 = document.createElement("span");
    openBoardBtn.appendChild(openBoardSpan3);

    const booksBlock = document.createElement("div");
    booksBlock.classList.add("books");
    boardBlock.appendChild(booksBlock);

    board.forEach((book) => {
      const card = renderBook(book);
      booksBlock.appendChild(card);
    });

    boards.appendChild(boardBlock);
  });

  if (!document.querySelector(".board")) {
    const emptyMessage = createEmptyMessage();
    boards.appendChild(emptyMessage);
  } else if (document.querySelector(".empty-message")) {
    const emptyMessage = document.querySelector(".empty-message");
    emptyMessage.remove();
  }
}

renderBoard(myLibrary);

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!target.closest("button")) {
    return;
  }

  if (target.closest("#new-board-btn")) {
    newBoardDialog.showModal();
    currentParent = null;
    currentForm = newBoardDialog.querySelector("form");
  }

  if (target.closest(".new-book-btn")) {
    newBookDialog.showModal();
    currentParent = target.closest(".board").dataset.board;
    currentForm = newBookDialog.querySelector("form");
  }

  if (target.closest(".close-dialog")) {
    closeDialog();
  }

  if (target.closest(".remove-board")) {
    delete myLibrary[`${target.dataset.board}`];
    renderBoard(myLibrary);
  }

  if (target.closest(".open-board")) {
    openBoard(target.closest(".board"));
  }

  if (target.closest(".remove")) {
    const idToDelete = target.closest(".book").dataset.id;
    const index = myLibrary[
      `${target.closest(".board").dataset.board}`
    ].findIndex((book) => book.id === idToDelete);

    if (index !== -1) {
      myLibrary[`${target.closest(".board").dataset.board}`].splice(index, 1);
    }

    renderBoard(myLibrary);
  }

  if (target.closest(".toggle")) {
    const idToChange = target.closest(".book").dataset.id;
    const index = myLibrary[
      `${target.closest(".board").dataset.board}`
    ].findIndex((book) => book.id === idToChange);

    let stat = "";

    if (index !== -1) {
      stat =
        myLibrary[`${target.closest(".board").dataset.board}`][index].status;
    } else {
      return;
    }

    myLibrary[`${target.closest('.board').dataset.board}`][index].toggleStatus();

    renderBoard(myLibrary);
  }
});

document.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = new FormData(currentForm);
  const target = document.querySelector(`[data-board='${currentParent}']`);

  if (currentParent) {
    const book = new Book(form);
    const board = myLibrary[currentParent];

    addBookToBoard(book, board);
    openBoard(target);
  } else {
    const board = new Board(form);

    myLibrary[board.title] = [];
  }

  currentForm.reset();
  closeDialog();
  renderBoard(myLibrary);
});
