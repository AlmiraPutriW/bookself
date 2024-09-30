const RENDER_EVENT = 'renderEvent';

function addBook() {
  const title = document.getElementById('bookFormTitle').value.trim();
  const author = document.getElementById('bookFormAuthor').value.trim();
  const year = parseInt(document.getElementById('bookFormYear').value.trim(), 10);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  if (title === '' || author === '' || isNaN(year)) {
    alert('Please fill out all fields with valid data.');
    return;
  }

  const book = {
    id: Date.now(),
    title,
    author,
    year,
    isComplete
  };

  const books = loadBooksFromStorage();
  books.push(book);
  saveBooksToStorage(books);

  document.dispatchEvent(new Event(RENDER_EVENT));
  document.getElementById('bookForm').reset();
}


function renderBooks() {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');
  const books = loadBooksFromStorage();

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  for (const book of books) {
    const bookElement = createBookElement(book);

    console.log(`Penulis: ${book.author}, Type: ${typeof book.author}`);
    console.log(`ID: ${book.id}, Type: ${typeof book.id}`);
    console.log(`Status Kelengkapan: ${book.isComplete ? 'sudah lengkap' : 'belum lengkap'} (${book.isComplete}), Type: ${typeof book.isComplete}`);
    console.log(`Judul: ${book.title}, Type: ${typeof book.title}`);
    console.log(`Tahun: ${book.year}, Type: ${typeof book.year}`);

    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
}




function createBookElement(book) {
  const bookElement = document.createElement('div');
  bookElement.setAttribute('data-bookid', book.id);
  bookElement.setAttribute('data-testid', 'bookItem');

  bookElement.innerHTML = `
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div>
      <button data-testid="bookItemIsCompleteButton">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
      <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      <button data-testid="bookItemEditButton">Edit Buku</button>
    </div>
  `;

  bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', () => {
    toggleCompleteStatus(book.id);
  });

  bookElement.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener('click', () => {
    deleteBook(book.id);
  });

  bookElement.querySelector('[data-testid="bookItemEditButton"]').addEventListener('click', () => {
    showEditModal(book);
  });

  return bookElement;
}


function searchBookByTitle() {
  const searchTitle = document.getElementById('searchBookTitle').value.trim().toLowerCase();
  const books = loadBooksFromStorage();
  const searchResult = document.getElementById('searchResult');
  searchResult.innerHTML = '';

  const cekBook = books.filter(book => book.title.toLowerCase().includes(searchTitle));

  if (cekBook.length > 0) {
    searchResult.innerHTML = '';
    for (const book of cekBook) {
      const resultElement = document.createElement('p');
      resultElement.textContent = `Buku dengan judul "${book.title}" ${book.isComplete ? 'sudah selesai dibaca.' : 'belum selesai dibaca.'}`;
      searchResult.appendChild(resultElement);
    }
  } else {
    searchResult.innerHTML = `<p>Buku dengan judul "${searchTitle}" tidak ditemukan.</p>`;
  }
}


function toggleCompleteStatus(bookId) {
  const books = loadBooksFromStorage();
  const book = books.find(book => book.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooksToStorage(books);

    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}


function deleteBook(bookId) {
  let books = loadBooksFromStorage();
  books = books.filter(book => book.id !== bookId);
  saveBooksToStorage(books);

  document.dispatchEvent(new Event(RENDER_EVENT));
}


function showEditModal(book) {
  document.getElementById('editBookId').value = book.id;
  document.getElementById('editBookTitle').value = book.title;
  document.getElementById('editBookAuthor').value = book.author;
  document.getElementById('editBookYear').value = book.year;
  document.getElementById('editBookModal').style.display = 'block';
}


function saveBookEdits() {
  const id = parseInt(document.getElementById('editBookId').value, 10);
  const title = document.getElementById('editBookTitle').value.trim();
  const author = document.getElementById('editBookAuthor').value.trim();
  const year = parseInt(document.getElementById('editBookYear').value.trim(), 10); // Menggunakan parseInt

  if (title === '' || author === '' || isNaN(year)) { // Memastikan year adalah number
    alert('Please fill out all fields with valid data.');
    return;
  }

  let books = loadBooksFromStorage();
  const book = books.find(book => book.id === id);

  if (book) {
    book.title = title;
    book.author = author;
    book.year = year;
    saveBooksToStorage(books);

    document.dispatchEvent(new Event(RENDER_EVENT));
    document.getElementById('editBookModal').style.display = 'none';
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const bookForm = document.getElementById('bookForm');
  const searchBookForm = document.getElementById('searchBook');
  const editBookModal = document.getElementById('editBookModal');

  renderBooks();

  bookForm.addEventListener('submit', event => {
    event.preventDefault();
    addBook();
  });

  searchBookForm.addEventListener('submit', event => {
    event.preventDefault();
    searchBookByTitle();
  });

  editBookModal.addEventListener('submit', event => {
    event.preventDefault();
    saveBookEdits();
  });

  document.getElementById('cancelEdit').addEventListener('click', () => {
    editBookModal.style.display = 'none';
  });

  document.addEventListener(RENDER_EVENT, () => {
    renderBooks();
  });
});
