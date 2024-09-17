require('dotenv').config();
const jwt = require("jsonwebtoken");

const jwtSec = process.env.JWT_SECRET ;

function AuthMiddleware(req,res,next){
    const token = req.headers.token;
    const decodedData = jwt.verify(token,jwtSec);

    if (decodedData){
        req.userId = decodedData.id ;
        next() ;
    }
    else{
        res.status(403).json({
            message : "Incorrect Credentials"
        })
    }
}

module.exports = { AuthMiddleware , jwtSec }