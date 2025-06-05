const express = require("express");
const userMiddleware = require("../middleware/user_auth");
const { Review } = require("../schema/dbSchema");
const { reviewSchema } = require("../schema/zodSchema");
const mongoose = require("mongoose");
const reviewsRouter = express.Router();

const ObjectId = mongoose.Types.ObjectId;

// PUT /reviews/:id – Update your own review
reviewsRouter.put("/:id", userMiddleware, async(req, res) => {
    
    // Converting book ID and user ID from String to ObjectId
    const bookId = new ObjectId(String(req.params.id));
    const userId = new ObjectId(String(req.userId));
    const { rating, comment } = req.body;
    
    const parsed = reviewSchema.safeParse({ bookId, userId, rating, comment});
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
    }

    const review = await Review.findOne({ bookId, userId });;
    if(!review){
        return res.status(404).send({msg : "Review not found"});
    }

    // Ensuring the review belongs to the authenticated user
    if (!review.userId.equals(userId)) {
        return res.status(403).send({ msg: "You can only change your review" });
    }

    // Update review fields
    review.rating = rating;
    review.comment = comment;
    await review.save();
    res.status(200).send({msg : "Your review has been updated"});
})

// DELETE /reviews/:id – Delete your own review
reviewsRouter.delete("/:id", userMiddleware, async(req, res) => {
    const bookId = new ObjectId(String(req.params.id));
    const userId = new ObjectId(String(req.userId));
    
    // Finding and deleting the review that matches bookId and userId
    const deletedReview = await Review.findOneAndDelete({ bookId, userId});
    if(deletedReview === null){
        return res.status(404).send({msg : "This review doesn't exist or you don't have permission to delete this"});
    }
    res.status(200).send({msg : "Your review has been deleted"});
})

module.exports = reviewsRouter;