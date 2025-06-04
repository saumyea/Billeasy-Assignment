const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

async function userMiddleware(req, res, next){
    const authHeader = req.headers.authorization;
    const jwtToken = authHeader.split(" ")[1];
    const decodedValue = jwt.verify(jwtToken, JWT_SECRET);

    if(decodedValue.username){
        req.userName = decodedValue.userName;
        next();
    }
    else{
        res.status(403).json({
            msg: "Invalid credentials or user doesn't exist"
        })
    }
}

module.exports = userMiddleware;