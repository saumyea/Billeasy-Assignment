const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

async function userMiddleware(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(404).send({msg : "Authentication Header Missing"});
    }

    const jwtToken = authHeader.split(" ")[1];
    const decodedValue = jwt.verify(jwtToken, JWT_SECRET);

    if(decodedValue.userName && decodedValue.userId){
        req.userName = decodedValue.userName;
        req.userId = decodedValue.userId;
        next();
    }
    else{
        return res.status(403).json({ msg: "Invalid credentials or user doesn't exist"});
    }
}

module.exports = userMiddleware;