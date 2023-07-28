const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");


const verifyToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer')) {
        res.status(401);
        throw new Error('Not authorized, please login first!');
    } else {
        const token = authHeader.split(' ')[1];

        try {
            const decoded = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                    if (err) {
                        // console.log(err);
                        reject(err);
                    } else {
                        resolve(decoded);
                    }
                });
            });

            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (err) {
            res.status(403);
            throw new Error('Forbidden');
        }
    }
});


const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;

    const user = await User.findOne({ email: email });

    if (user.role !== 'admin') {
        res.status(403);
        throw new Error('Unauthorized request!');
    } else {
        next();
    }
});


module.exports = { verifyToken, isAdmin };