const express = require("express");
const reviewsRouter = express.Router();
const userMiddleware = require("../middleware/user_auth");
const { User, Book, Review } = require("../db");

// PUT /reviews/:id – Update your own review
reviewsRouter.put("/:id", (req, res)=>{

})

// DELETE /reviews/:id – Delete your own review
reviewsRouter.delete("/:id", (req, res)=>{

})

module.exports = reviewsRouter;