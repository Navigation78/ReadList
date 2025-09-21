const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

//  Enable CORS for all requests
app.use(cors());

// Example route
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
