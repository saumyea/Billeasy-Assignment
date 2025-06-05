const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

async function userMiddleware(req, res, next){
    const authHeader = req.headers.authorization;

    // Checking if authorization header is present with proper formatting
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(404).send({msg : "Authentication Header Missing"});
    }
    const jwtToken = authHeader.split(" ")[1];   
    try {
        const decodedValue = jwt.verify(jwtToken, JWT_SECRET);
        
        // Attaching user info to the request if valid
        if(decodedValue.userName && decodedValue.userId){
            req.userName = decodedValue.userName;
            req.userId = decodedValue.userId;
            next();
        }
        else{
            return res.status(403).json({ msg: "Invalid credentials or user doesn't exist"});
        }
    } catch (err) {
        return res.status(401).json({ msg: "Unauthorized: Invalid token" });
    }
}

module.exports = userMiddleware;