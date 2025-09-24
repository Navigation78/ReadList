require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("./models/Book");

async function run() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB ✅");

    // Create a sample book
    const sampleBook = new Book({
      title: "The Alchemist",
      author: "Paulo Coelho",
      pages: 197,
      genres: ["Fiction", "Philosophy"],
      status: "finished",
    });

    // Save it
    await sampleBook.save();
    console.log("Book saved:", sampleBook);

    // Close the connection
    mongoose.connection.close();
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
