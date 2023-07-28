const asyncHandler = require("express-async-handler");
const User = require("../models/User.js");
const { generateToken } = require("../config/generateToken.js");
const { generateRefreshToken } = require("../config/refreshToken.js");
const jwt = require("jsonwebtoken");


// @desc    Register user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists!");
    };

    const user = await User.create(req.body);

    if (user) {
        userWithoutPassword = await User.findOne(user._id).select('-password');
        res.status(201).json(userWithoutPassword);
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});


// @desc    Login user and get jwt token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400);
        throw new Error('All fields are required!');
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        let accessToken = generateToken(user?._id);
        let refreshToken = generateRefreshToken(res, user?._id);

        const updatedUser = await User.findByIdAndUpdate
            (
                user._id,
                { refreshToken: refreshToken, },
                { new: true }
            ).select('-password');

        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: accessToken,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});


// @desc    Handle refresh token
// @route   /api/users/refresh-token
// @access  Public - because access token has expired
const handleRefreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        res.status(401);
        throw new Error('No refresh token in cookies!');
    }

    // check if current refresh-token matches with the one in DB
    const user = await User.findOne({ refreshToken });

    if (!user) {
        res.status(401);
        throw new Error('Invalid refresh token');
    } else {
        jwt.verify
            (
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                async (err, decoded) => {
                    if (err) return res.status(403).json({ message: 'Forbidden' });

                    const accessToken = generateToken(user._id);
                    res.json({ accessToken })
                }
            );
    }
});


// @desc    Logout user and delete jwt token from cookie
// @route   /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        res.status(401);
        throw new Error('No user logged in!');
    }

    res.cookie("refreshToken", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    const user = await User.findOneAndUpdate({ refreshToken }, {
        refreshToken: "",
    }, { new: true }).select('-password');

    res.status(200).json({ message: "Logged out successfully!" });
});


// @desc    Get all users
// @route   /api/users/all-users
// @access  Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    if (users) {
        res.status(200).json(users);
    } else {
        res.status(404);
        throw new Error('No users found!');
    }
});


// @desc    Get single user
// @route   /api/users/:id
// @access  Private
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('User does not exist!');
    }
});


// @desc    Update user
// @route   /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobile: req.body.mobile,
    }, { new: true }).select('-password');

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('User does not exist!');
    }
});


// @desc    Delete user
// @route   /api/users/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id).select('-password');

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('User does not exist!');
    }
});


module.exports = { registerUser, loginUser, logoutUser, getAllUsers, getUser, updateUser, deleteUser, handleRefreshToken };