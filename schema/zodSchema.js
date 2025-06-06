const {z} = require("zod");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const userSchema = z.object({
    "userName" : z.string().max(50),
    "password" : z.string().min(8),
});

const bookSchema = z.object({
    "title" : z.string().max(100),
    "genre" : z.string().max(50).optional(),
    "author" : z.string().max(50).optional(),
});

const reviewSchema = z.object({
    "userId" : z.instanceof(ObjectId),
    "bookId" : z.instanceof(ObjectId),
    "rating" : z.number().int().min(1).max(5),
    "comment" : z.string().max(100),
});

module.exports = { userSchema, bookSchema, reviewSchema };