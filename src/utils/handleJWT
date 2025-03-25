const jwt = require("jsonwebtoken")
require('dotenv').config(); // Asegúrate de que esto esté al principio de tu archivo principal

const JWT_SECRET = process.env.SECRET_JWT

function tokenSign(user){
    const sign = jwt.sign(
        {
            _id: user._id,
            role: user.role
        },
        JWT_SECRET,
        {
            expiresIn: "120d" //TODO: cambiar a 7
        }
    )
    return sign
}

function verifyToken(tokenJwt){
    try {
        return jwt.verify(tokenJwt, JWT_SECRET)
    } catch(e) {
        console.log(e)
    }
}

module.exports = {tokenSign, verifyToken}