const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter a name"]
    },
    avatar:{
        //cloudinary
        publicId: String,
        url: String
    },
    email:{
        type: String,
        required: [true, "Please enter an email"],
        unique: [true, "Emai already exists"]
    },
    password:{
        type: String,
        required: [true, "Please enter password"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false
    },
    posts: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    followers: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    followings: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

userSchema.pre("save", async function(next){
    if(!this.isModified(this.password)){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next()
})

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = function (){
    return jwt.sign({_id:this.id}, process.env.JWT_SECRET);
}


module.exports = mongoose.model("User", userSchema);