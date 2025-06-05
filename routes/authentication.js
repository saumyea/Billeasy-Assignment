const express = require("express");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const { User } = require("../schema/dbSchema");

const JWT_SECRET = process.env.JWT_SECRET;

const saltRounds = 10; 

// POST /signup – register a new user
authRouter.post("/signup", async(req, res)=>{
    const userName = req.body.userName;
    const password = req.body.password;
    try{
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Save the user with hashed password (not plaintext password)
        await User.create({ userName, hashedPassword }); 
        res.status(200).json({msg : "User Created"});
    }catch{
        res.status(403).json({msg : "User already exists"});
    }
})

// POST /login – authenticate and return a token
authRouter.post("/login", async(req, res)=>{
    const userName = req.body.userName;
    const password = req.body.password;

    const user = await User.findOne({userName})
    if(!user){
        return res.status(403).json({msg : "Wrong credentials or user doesn't exist"});
    }
    
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword)
    if(passwordMatch){
        // Signing a token with username and userId as payload
        const token = jwt.sign({
            userName,
            userId : user._id
        }, JWT_SECRET);
        console.log(token); // For debugging purpose
        res.status(200).json({token});
    } else{
        res.status(403).json({msg : "Wrong credentials or user doesn't exist"});
    }
})


module.exports = authRouter; // Exporting the router