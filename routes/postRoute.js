const express = require('express');
const { createPost, handleLike, deletePost, getPostOfFollowing } = require('../controllers/postController');
const { isLoggedIn } = require('../middleware/authMiddleware');

const router = express.Router();

router.route("/post/upload").post(isLoggedIn, createPost);
router.route("/post/:id").get(isLoggedIn, handleLike).delete(isLoggedIn, deletePost);
router.route("/posts").get(isLoggedIn, getPostOfFollowing);

module.exports = router;
