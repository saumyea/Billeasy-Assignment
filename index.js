require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const authRouter = require("./routes/authentication");
const booksRouter = require("./routes/books");
const reviewsRouter = require("./routes/reviews");
// const searchRouter = require("./routes/search");

app = express();
app.use(express.json()); // Middleware to parse incoming JSON requests
let PORT = process.env.PORT || 5000;

// Route handlers
app.use("/", authRouter);
app.use("/books", booksRouter);
app.use("/reviews", reviewsRouter);
// app.use("/search", searchRouter);

app.listen(PORT, ()=>{
    console.log("Server is running on port : ", PORT);
})