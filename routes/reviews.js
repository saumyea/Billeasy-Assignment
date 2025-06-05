const express = require("express");
const userMiddleware = require("../middleware/user_auth");
const { Review } = require("../db");

const reviewsRouter = express.Router();

// PUT /reviews/:id – Update your own review
reviewsRouter.put("/:id", userMiddleware, async(req, res) => {
    const id = req.params.id;
    const userId = req.userId;
    const { bookId, rating, comment } = req.body;
    const review = await Review.findById(id);
    if(!review || !bookId){
        return res.status(404).send("Review not found");
    }
    if(review.userId !== userId){
        return res.status(404).send("You can only change your review");
    }
    review.rating = rating;
    review.comment = comment;
    await review.save();
    res.status(200).send("Your review has been updated");
})

// DELETE /reviews/:id – Delete your own review
reviewsRouter.delete("/:id", userMiddleware, async(req, res) => {
    const id = req.params.id;
    const userId = req.userId;
    const deletedReview = await Review.findOneAndDelete({_id : id, userId : userId});
    if(deletedReview === null){
        return res.status(404).send("This review doesn't exist or you don't have permission to delete this");
    }
    res.status(200).send("Your review has been deleted");
})

module.exports = reviewsRouter;