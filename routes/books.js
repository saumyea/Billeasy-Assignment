const express = require("express");
const booksRouter = express.Router();
const userMiddleware = require("../middleware/user_auth");
const { Book, Review } = require("../schema/dbSchema");
const { bookSchema, reviewSchema } = require("../schema/zodSchema");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

// POST /books – Add a new book (Authenticated users only)
booksRouter.post("/", userMiddleware, async(req, res) => {
    const {title , genre, author} = req.body;
    
    // Validate input using Zod schema
    const parsed =  bookSchema.safeParse({title , genre, author});
    if(!parsed.success){
        return res.status(400).json({ error: parsed.error.errors });
    }

    // Save new book to the database    
    const newBook = new Book({title, genre, author});
    await newBook.save();
    console.log("New book : ", newBook);
    res.status(200).send({msg : "New book added"});
})


// GET /books – Get all books (with pagination and optional filters by author and genre)
booksRouter.get("/", userMiddleware, async(req, res) => {
    const genre = req.query.genre;
    const author = req.query.author;

    const page = parseInt(req.query.page) || 1;      
    const limit = parseInt(req.query.limit) || 10;  //offset 
    const skip = (page - 1) * limit;
   
    filter = {};
    if(author){
        filter.author = author;
    }
    if(genre){
        filter.genre = genre;
    }

    // Retrieve books matching filters, with pagination
    const allBooks = await Book.find(filter).skip(skip).limit(limit).lean();
    const count = await Book.countDocuments(filter);

    return res.status(200).json({
        allBooks,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
    });
})


// GET /books/:id – Get book details by ID, including:
// ○ Average rating
// ○ Reviews (with pagination)
booksRouter.get("/:id", userMiddleware, async(req, res) => {
    const bookId = new ObjectId(String(req.params.id));
    const bookDetails = await Book.findById(bookId);

    const page = parseInt(req.query.page) || 1;      
    const limit = parseInt(req.query.limit) || 10;  //offset 
    const skip = (page - 1) * limit;

    const allReviews = await Review.find({bookId}).skip(skip).limit(limit).lean();
    const count = await Review.countDocuments({bookId});

    // Finding average rating using aggregation
    const avgRating = await Review.aggregate([
        {$match : {bookId : bookId}},
        {$group : {_id : null, avgRating : {$avg : "$rating"}}},
    ]);
    const averageRating = avgRating[0]?.avgRating || null;

    res.status(200).json({
        bookDetails, 
        averageRating,
        allReviews, 
        totalPages: Math.ceil(count / limit),
        currentPage: page,
    })
})  


// POST /books/:id/reviews – Submit a review (Authenticated users only, one review per user per book)
booksRouter.post("/:id/reviews", userMiddleware, async(req, res) => {
    const bookId = new ObjectId(String(req.params.id));
    const userId = new ObjectId(String(req.userId));
    const {rating, comment} = req.body;
    
    const parsed = reviewSchema.safeParse({bookId, userId, rating, comment});
    if(!parsed.success){
        return res.status(400).json({ error: parsed.error.errors });
    }

    // Checking if the user has already reviewed this book
    const reviewExists = await Review.findOne({bookId, userId});
    if(reviewExists){
        return res.status(404).send({msg: "You cannot give multiple reviews for the same book"});
    }
  
    // Saving new review to the db
    const newReview = new Review({bookId, userId, rating, comment});
    await newReview.save();
    console.log("New Review : ", newReview);
    res.status(200).send({msg : "Your review is submitted"});
})


module.exports = booksRouter;