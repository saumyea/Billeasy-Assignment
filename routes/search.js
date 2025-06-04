const express = require("express");
const searchRouter = express.Router();
const userMiddleware = require("../middleware/user_auth");
const { User, Book, Review } = require("../db");

// GET /search – Search books by title or author (partial and case-insensitive)
searchRouter.get("/", (req, res)=>{

})

module.exports = searchRouter;