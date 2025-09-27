require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("./models/Book");

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB ✅");

    const sampleBook = new Book({
      title: "The Alchemist",
      author: "Paulo Coelho",
      pages: 197,
      genres: ["Fiction", "Philosophy"],
      status: "finished",
    });

    await sampleBook.save();
    console.log("Book saved:", sampleBook);

    mongoose.connection.close();
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
