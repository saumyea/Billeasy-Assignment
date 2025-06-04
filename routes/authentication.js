const express = require("express");
const signupRouter = express.Router();
const loginRouter = express.Router();
const userMiddleware = require("../middleware/user_auth");
const { User } = require("../db");

// Endpoints:

// POST /signup – register a new user
signupRouter.post("/", (req, res)=>{

})
// POST /login – authenticate and return a token
loginRouter.post("/", (req, res)=>{
    
})

module.exports = {signupRouter, loginRouter};