// server/routes/books.js
const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add new book
router.post("/", async (req, res) => {
  try {
    const { googleBookId, title, author, coverImage, status } = req.body;

    const existing = await Book.findOne({ googleBookId });
    if (existing) return res.status(400).json({ message: "Book already saved" });

    const newBook = new Book({ googleBookId, title, author, coverImage, status });
    await newBook.save();

    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: "Error saving book" });
  }
});

// Update book status
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Book.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Book not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating book" });
  }
});

// Delete book
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
