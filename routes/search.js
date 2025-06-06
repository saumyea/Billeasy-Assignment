const express = require("express");
const searchRouter = express.Router();
const userMiddleware = require("../middleware/user_auth");
const {Book} = require("../schema/dbSchema");
const {bookSchema} = require("../schema/zodSchema");

// GET /search – Search books by title or author (partial and case-insensitive)
searchRouter.get("/", userMiddleware, async(req, res)=>{
    const title = req.query.title;
    const author = req.query.author;
    
    const filters = [];
    if (title) {
        filters.push({ title: { $regex: title, $options: "i" } });
    }
    if (author) {
        filters.push({ author: { $regex: author, $options: "i" } });
    }

    const matchedBooks = await Book.find(filters.length ? { $or: filters } : {}).lean();

    const books = matchedBooks.map(({ _id, __v, ...rest }) => ({
        bookId: _id,
        ...rest,
    }));

    if(books.length === 0) {
        return res.status(404).json({ msg: "No book found." });
    }

    res.status(200).json({ books });
})

module.exports = searchRouter;