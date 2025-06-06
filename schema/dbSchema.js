const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config(); 
mongoose.connect(process.env.MONGODB_URL);

const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
	"userName" : {type : String, unique : true, required : true},
	"hashedPassword" : {type : String, required : true},
});

const bookSchema = new Schema({
	"title" : {type : String, unique : true, required : true},
	"genre" : String,
	"author" : {type : String},
})

const reviewSchema = new Schema({
	"userId" : {type : ObjectId, ref : "User", required : true},
	"bookId" : {type : ObjectId, ref : "User", required : true},
	"rating" :	{type : Number, required : true},
	"comment" : {type : String, required : true},
})
.index({ userId: 1, bookId: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
const Book = mongoose.model("Book", bookSchema);
const Review = mongoose.model("Review", reviewSchema);

module.exports = {
	User,
	Book,
	Review
}   