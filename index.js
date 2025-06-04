require("dotenv").config();
const express = require("express");
const {signupRouter, loginRouter} = require("./routes/authentication");
const booksRouter = require("./routes/books");
const reviewsRouter = require("./routes/reviews");
const searchRouter = require("./routes/search");

app = express();
let PORT = process.env.PORT || 5000;

app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/books", booksRouter);
app.use("/reviews", reviewsRouter);
app.use("/search", searchRouter);


app.listen(PORT, ()=>{
    console.log("Server is running on port : ", PORT);
})