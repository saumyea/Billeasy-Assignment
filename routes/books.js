const express = require("express");
const booksRouter = express.Router();
const userMiddleware = require("../middleware/user_auth");
const { User, Book, Review } = require("../db");

// POST /books – Add a new book (Authenticated users only)
booksRouter.post("/", userMiddleware, (req, res)=>{
    const title = req.body.title;
    const genre = req.body.genre;
    const author = req.body.author;

    if(!title){
        res.status(404).send("Title field is necessary")
    }

    const newBook = new Book({"title" : title, "genre" : genre, "author" : author});
    console.log("New book : ", newBook);
    res.status(200).send("New book added");
})

// GET /books – Get all books (with pagination and optional filters by author and
// genre)
booksRouter.get("/", (req, res)=>{
    
})

// GET /books/:id – Get book details by ID, including:
// ○ Average rating
// ○ Reviews (with pagination)
booksRouter.get("/:id", (req, res)=>{
    const id = req.params.id;
})

// POST /books/:id/reviews – Submit a review (Authenticated users only, one
// review per user per book)
booksRouter.post("/:id/reviews", (req, res)=>{

})

module.exports = booksRouter;