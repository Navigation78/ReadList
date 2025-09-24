const mongoose = require("mongoose");

// Define the schema
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // every book must have a title
  },
  author: {
    type: String,
    required: true, // every book must have an author
  },
  pages: {
    type: Number,
    min: 1, // at least 1 page
  },
  genres: {
    type: [String], // array of strings (["Fiction", "Romance", "Mystery"])
    default: [],
  },
  status: {
    type: String,
    enum: ["wishlist", "reading", "finished"], // only these values allowed
    default: "wishlist",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model from schema
const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
