const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config(); 
mongoose.connect(process.env.MONGODB_URL);

const userSchema = new Schema({
	"userName" : {type : String, unique : true},
	"password" : String,
});

const bookSchema = new Schema({
	"title" : {type : String, unique : true},
	"genre" : String,
	"author" : {type : String, unique : true},
})

const reviewSchema = new Schema({
	"bookId" : String,
	"userId" : String,
	"rating" : Number,
	"comment" : String,
})

const User = mongoose.model("User", userSchema);
const Book = mongoose.model("User", bookSchema);
const Review = mongoose.model("User", reviewSchema);

module.exports = {
	User,
	Book,
	Review
}   