const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateToken = (id) => {
    const token = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30s",
    });

    return token;
};

module.exports = { generateToken }; 