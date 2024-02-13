const userModel = require('../model/user.model');
const user = require('../model/user.model')

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        let newUser = await user.create({ name, email, password });
        res.status(201).json({ success: true, newUser });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userEntered = await user.findOne({ email }).select("+password"); //kyuki model m assword ko select false kiya hai toh woh bina + kiye hi aayega
        if (!userEntered) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }

        const isMatch = await userEntered.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Password Incorrect"
            })
        }

        const token = await userEntered.generateToken();

        res.status(200)
            .cookie("token", token, {
                expires: new Date(Date.now() + 30 * 24 * 60 * 1000), //30 din ko milisec m likha hai
                httpOnly: true
            })
            .json({
                success: true,
                userEntered,
                token
            });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login error: " + error
        })
    }
}

exports.logout = async (req, res) => {
    try {
        res
            .status(200)
            .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true }).json({
                status: true,
                messaage: "Logged Out"
            })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Log Out error"
        })
    }
}

exports.follow = async (req, res) => {
    try {
        const userToFollow = await userModel.findById(req.params.id);
        const userLoggedIn = await userModel.findById(req.user._id);

        if (!userToFollow) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }

        if (userLoggedIn.followings.includes(userToFollow._id)) {

            const indexFollowing = userLoggedIn.followings.indexOf(userToFollow._id);
            userLoggedIn.followings.splice(indexFollowing, 1);

            await userLoggedIn.save();

            const indexFollowers = userToFollow.followers.indexOf(userLoggedIn._id);
            userToFollow.followers.splice(indexFollowers, 1);

            await userToFollow.save();


            return res.status(400).json({
                success: true,
                messaage: "User Unfollowed"
            })
        }

        userToFollow.followers.push(userLoggedIn._id);
        userLoggedIn.followings.push(userToFollow._id);

        await userLoggedIn.save();
        await userToFollow.save();

        res.status(200).json({
            success: true,
            message: "User Followed"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Following Error",
            error: error
        })
    }
}

exports.myProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).populate("posts");
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            messaage: "Failed to fetch profile",
            error: error
        })
    }
}

exports.userProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id).populate("posts");

        if(!user){
            res.status(200).json({
                success: false,
                messaage: "User does not exist"
            })
        }

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            messaage: "Failed to fetch profile",
            error: error
        })
    }
}

exports.getAllUser = async (req, res) => {
    try {
        const users = await userModel.find({});

        res.status(200).json({
            success: true,
            messaage: "All user fetched",
            users
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            messaage: "Failed to get users",
            error: error
        })
    }
}