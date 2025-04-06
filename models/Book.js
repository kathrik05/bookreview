const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewer: String,
  comment: String,
  rating: Number
});

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  releaseDate: String, // new field
  summary: String,
  reviews: [reviewSchema]
});

module.exports = mongoose.model('Book', bookSchema);
