const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateRefreshToken = (res, id) => {
    const token = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "3d",
    });

    res.cookie('refreshToken', token, {
        httpOnly: true, // only accessible via a web server
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    return token;
};

module.exports = { generateRefreshToken }; 