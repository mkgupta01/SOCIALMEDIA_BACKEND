const postModel = require("../model/post.model")
const userModel = require("../model/user.model")

exports.createPost = async (req, res) => {
    try {
        const postData = {
            caption: req.body.caption,
            image: {
                public_id: req.body.public_id,
                url: req.body.url
            },
            owner: req.user._id
        };

        const newPost = await postModel.create(postData);
        const user = await userModel.findById(req.user._id);

        user.posts.push(newPost._id);

        await user.save();

        res.status(201).json({
            success: true,
            post: newPost,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.deletePost = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not Found"
            });
        }

        // condition to check if the user logged in is the owner of the post
        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "User Unauthorized"
            });
        }

        await post.deleteOne();

        const user = await userModel.findById(req.user._id);
        const index = user.posts.indexOf(req.params.id);
        user.posts.splice(index, 1);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Post Deleted"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Delete Post Error",
            error: error
        });
    }
}

exports.handleLike = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        if (post.likes.includes(req.user._id)) {
            const index = post.likes.indexOf(req.user._id);
            post.likes.splice(index, 1);

            await post.save();

            res.status(200).json({
                success: true,
                message: "Post Unliked"
            })
        } else {
            post.likes.push(req.user._id);
            await post.save();

            return res.status(200).json({
                success: true,
                message: "Post Liked"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Handle Like error", error
        })
    }
}

exports.getPostOfFollowing = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);

        const posts = await postModel.find({
            owner: {
                $in: user.followings // $in in an operator in mongodb
            }
        })
        
        res.status(201).json({
            success: true,
            posts: posts   
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "view post error",
            error:error
        })
    }
}