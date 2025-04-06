const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Add a book
router.post('/', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).send(book);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get list of books with reviews
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.send(books);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Add a review to a book
router.post('/:id/reviews', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    book.reviews.push(req.body);
    await book.save();
    res.send(book);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
