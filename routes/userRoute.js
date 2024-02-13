const express = require('express');
const { register, login, follow, logout, myProfile, userProfile, getAllUser } = require('../controllers/userController');
const { isLoggedIn } = require('../middleware/authMiddleware')

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/follow/:id").get(isLoggedIn, follow);
router.route("/logout").get(logout);
router.route("/me").get(isLoggedIn, myProfile);
router.route("/user/:id").get(isLoggedIn, userProfile);
router.route("/getuserall").get(isLoggedIn, getAllUser);

module.exports = router;
