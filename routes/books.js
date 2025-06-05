const express = require("express");
const booksRouter = express.Router();
const userMiddleware = require("../middleware/user_auth");
const { User, Book, Review } = require("../db");

// POST /books – Add a new book (Authenticated users only)
booksRouter.post("/", userMiddleware, async(req, res)=>{
    const title = req.body.title;
    const genre = req.body.genre;
    const author = req.body.author;

    if(!title){
        return res.status(404).send("Title field is necessary")
    }

    const newBook = new Book({"title" : title, "genre" : genre, "author" : author});
    await newBook.save();
    console.log("New book : ", newBook);
    res.status(200).send("New book added");
})


// GET /books – Get all books (with pagination and optional filters by author and genre)
booksRouter.get("/", userMiddleware, (req, res)=>{
    
})


// GET /books/:id – Get book details by ID, including:
// ○ Average rating
// ○ Reviews (with pagination)
booksRouter.get("/:id", userMiddleware, (req, res)=>{
    const id = req.params.id;

})


// POST /books/:id/reviews – Submit a review (Authenticated users only, one review per user per book)
booksRouter.post("/:id/reviews", userMiddleware, async(req, res)=>{
    const bookId = req.params.id;
    const userId = req.userId;
    const {rating, comment} = req.body;
    
    if(!userId || !bookId){
        return res.status(404).send("User Id and Book Id missing");
    }

    const reviewExists = await Review.findOne({bookId : bookId, userId : userId});
    if(reviewExists){
        return res.status(404).send("You cannot give multiple reviews for the same book");
    }

    const newReview = new Review({bookId : bookId, userId : userId, rating : rating, comment : comment});
    await newReview.save();
    console.log("New Review : ", newReview);
    res.status(200).send("Your review is submitted");
})


module.exports = booksRouter;