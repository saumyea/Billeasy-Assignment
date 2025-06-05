const express = require("express");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const { User } = require("../schema/dbSchema");

const JWT_SECRET = process.env.JWT_SECRET;
console.log(JWT_SECRET);
const saltRounds = 10; 

// POST /signup – register a new user
authRouter.post("/signup", async(req, res)=>{
    const userName = req.body.userName;
    const password = req.body.password;
    try{
        // const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await User.create({ userName, hashedPassword });
        res.status(200).send({msg : "User Created"});
    }catch{
        res.status(403).send({msg : "User already exists"});
    }
})

// POST /login – authenticate and return a token
authRouter.post("/login", async(req, res)=>{
    const userName = req.body.userName;
    const password = req.body.password;

    const user = await User.findOne({userName})
    if(!user){
        return res.status(403).send({msg : "Wrong credentials or user doesn't exist"});
    }
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword)
    if(passwordMatch){
        const token = jwt.sign({
            userName,
            userId : user._id
        }, JWT_SECRET);
        console.log(token);
        res.status(200).send(token);
    } else{
        res.status(403).send({msg : "Wrong credentials or user doesn't exist"});
    }
})


module.exports = authRouter;