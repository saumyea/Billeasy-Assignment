const express = require("express");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const { User } = require("../schema/dbSchema");
const { userSchema } = require("../schema/zodSchema");
const JWT_SECRET = process.env.JWT_SECRET;

const saltRounds = 10; 

// POST /signup – register a new user
authRouter.post("/signup", async(req, res)=>{
    const userName = req.body.userName;
    const password = req.body.password;
    const parsed = userSchema.safeParse({userName, password});
    if(parsed.success){
        try{
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            // Save the user with hashed password (not plaintext password)
            await User.create({ userName, hashedPassword }); 
            res.status(201).json({msg : "User Created"});
        }catch{
            res.status(403).json({msg : "User already exists"});
        }
    }else{
        res.status(400).json({ error: "Validation Failed" });
    }
})

// POST /login – authenticate and return a token
authRouter.post("/login", async(req, res)=>{
    const userName = req.body.userName;
    const password = req.body.password;

    const parsed = userSchema.safeParse({userName, password});
    if(parsed.success){
        const user = await User.findOne({userName})
        if(!user){
            return res.status(401).json({msg : "Wrong credentials or user doesn't exist"});
        }
        
        const passwordMatch = await bcrypt.compare(password, user.hashedPassword)
        if(passwordMatch){
            // Signing a token with username and userId as payload
            const token = jwt.sign({
                userName,
                userId : user._id
            }, JWT_SECRET);
            console.log(token); // For debugging purpose
            res.status(200).json({msg : "User logged in successfully",token});
        } else{
            res.status(401).json({msg : "Wrong credentials or user doesn't exist"});
        }
    }else{
        res.status(400).json({ error: "Validation Failed" });
    }


})

module.exports = authRouter; // Exporting the router