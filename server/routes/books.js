// server/routes/books.js
const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const supabase = require("../lib/supabaseServer");

// helper: get user from Authorization header (Bearer <token>)
async function getUserFromReq(req) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null
  if (!token) {
    console.warn(`[auth] No Authorization token provided - ${req.method} ${req.originalUrl}`)
    return { user: null, error: { message: 'No token provided' } }
  }

  try {
    // Do not log token contents; only its length for debugging
    console.debug(`[auth] Verifying token (len=${token.length}) for ${req.method} ${req.originalUrl}`)
    const { data, error } = await supabase.auth.getUser(token)
    if (error) {
      console.error(`[auth] Supabase getUser error for ${req.method} ${req.originalUrl}:`, error.message || error)
      return { user: null, error }
    }

    if (!data || !data.user) {
      console.warn(`[auth] No user returned by Supabase for ${req.method} ${req.originalUrl}`)
      return { user: null, error: { message: 'Invalid token' } }
    }

    return { user: data.user, error: null }
  } catch (err) {
    console.error(`[auth] Unexpected error verifying token for ${req.method} ${req.originalUrl}:`, err && err.stack ? err.stack : err)
    return { user: null, error: { message: 'Token verification failed', detail: err && err.message ? err.message : err } }
  }
}

// Get all books for the authenticated user
router.get("/", async (req, res) => {
  const { user, error } = await getUserFromReq(req)
  if (error || !user) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const books = await Book.find({ ownerId: user.id });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add new book (owned by authenticated user)
router.post("/", async (req, res) => {
  const { user, error } = await getUserFromReq(req)
  if (error || !user) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const { googleBookId, title, author, coverImage, status } = req.body;

    const existing = await Book.findOne({ googleBookId, ownerId: user.id });
    if (existing) return res.status(400).json({ message: "Book already saved" });

    const newBook = new Book({ googleBookId, title, author, coverImage, status, ownerId: user.id });
    await newBook.save();

    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: "Error saving book" });
  }
});

// Update book status (only owner)
router.put("/:id", async (req, res) => {
  const { user, error } = await getUserFromReq(req)
  if (error || !user) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const { status } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.ownerId !== user.id) return res.status(403).json({ message: "Forbidden" });

    book.status = status;
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Error updating book" });
  }
});

// Delete book (only owner)
router.delete("/:id", async (req, res) => {
  const { user, error } = await getUserFromReq(req)
  if (error || !user) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.ownerId !== user.id) return res.status(403).json({ message: "Forbidden" });

    // ✅ Use deleteOne() or findByIdAndDelete()
    await Book.findByIdAndDelete(req.params.id);
    // OR: await book.deleteOne();
    
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
