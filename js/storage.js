
const SAVED_EVENT = 'savedBook';
const STORAGE_KEY = 'BOOK_APPS';


function saveBooksToStorage(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  document.dispatchEvent(new Event(SAVED_EVENT));
}


function loadBooksFromStorage() {
  const booksJSON = localStorage.getItem(STORAGE_KEY);
  if (booksJSON) {
    return JSON.parse(booksJSON);
  }
  return [];
}
