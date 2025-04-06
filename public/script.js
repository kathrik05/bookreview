const bookList = document.getElementById('bookList');
const bookModal = document.getElementById('bookModal');
const modalTitle = document.getElementById('modalTitle');
const modalAuthor = document.getElementById('modalAuthor');
const modalDate = document.getElementById('modalDate');
const modalSummary = document.getElementById('modalSummary');
const modalReviews = document.getElementById('modalReviews');
const closeModal = document.getElementById('closeModal');
const reviewerInput = document.getElementById('reviewerInput');
const ratingInput = document.getElementById('ratingInput');
const commentInput = document.getElementById('commentInput');
const submitReviewBtn = document.getElementById('submitReviewBtn');

let currentBookId = null;

// Fetch books from backend
async function fetchBooks() {
  const res = await fetch('/books');
  const books = await res.json();
  renderBooks(books);
}

function renderBooks(books) {
  bookList.innerHTML = '';
  books.forEach(book => {
    const tile = document.createElement('div');
    tile.className = 'book-tile';
    tile.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      ${book.reviews[0] ? `<p><em>"${book.reviews[0].comment}"</em></p>` : '<p>No reviews yet</p>'}
      <button onclick="showDetails('${book._id}')">More Details</button>
    `;
    bookList.appendChild(tile);
  });
}

// Show modal with book details
async function showDetails(bookId) {
  const res = await fetch(`/books`);
  const books = await res.json();
  const book = books.find(b => b._id === bookId);

  currentBookId = bookId;
  modalTitle.textContent = book.title;
  modalAuthor.textContent = book.author;
  modalDate.textContent = book.releaseDate || 'Not available';
  modalSummary.textContent = book.summary || 'No summary';

  modalReviews.innerHTML = '';
  book.reviews.forEach(r => {
    const li = document.createElement('li');
    li.textContent = `${r.reviewer}: "${r.comment}" (${r.rating}/5)`;
    modalReviews.appendChild(li);
  });

  bookModal.classList.remove('hidden');
}

// Submit review
submitReviewBtn.onclick = async () => {
  const reviewer = reviewerInput.value;
  const rating = ratingInput.value;
  const comment = commentInput.value;

  await fetch(`/books/${currentBookId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviewer, rating, comment })
  });

  showDetails(currentBookId); // refresh modal
  reviewerInput.value = '';
  ratingInput.value = '';
  commentInput.value = '';
};

// Close modal
closeModal.onclick = () => bookModal.classList.add('hidden');

// Add book (basic prompt for now)
document.getElementById('addBookBtn').onclick = async () => {
  const title = prompt('Book title:');
  const author = prompt('Author:');
  const releaseDate = prompt('Release Date (optional):');
  const summary = prompt('Summary (optional):');

  await fetch('/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, author, releaseDate, summary })
  });

  fetchBooks();
};

// Load books on page load
fetchBooks();
