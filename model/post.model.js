const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    caption: String,
    image: {
        //according to cloudinary
        publicId: String,
        url: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        },
        {
            comment: {
                type: String,
                required: true
            }
        }
    ]

});

module.exports = mongoose.model("Post", postSchema);