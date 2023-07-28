const express = require("express");
const { registerUser, loginUser, logoutUser, getAllUsers, getUser, deleteUser, updateUser, handleRefreshToken } = require("../controllers/users.js");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware.js");


const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh-token", handleRefreshToken);
router.post("/logout", logoutUser);


router.get("/all-users", verifyToken, isAdmin, getAllUsers);
router.get("/:id", verifyToken, isAdmin, getUser);
router.put("/:id", verifyToken, isAdmin, updateUser);
router.delete("/:id", verifyToken, isAdmin, deleteUser);


module.exports = router;