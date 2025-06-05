require("dotenv").config();
const express = require("express");
const authRouter = require("./routes/authentication");

app = express();
app.use(express.json());
let PORT = process.env.PORT || 5000;

app.use("/", authRouter);

app.listen(PORT, ()=>{
    console.log("Server is running on port : ", PORT);
})