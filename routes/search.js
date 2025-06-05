const express = require("express");
const searchRouter = express.Router();
const userMiddleware = require("../middleware/user_auth");
const {Book} = require("../schema/dbSchema");

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

    const books = await Book.find(filters.length ? { $or: filters } : {});
    res.status(200).json({ books });
})

module.exports = searchRouter;