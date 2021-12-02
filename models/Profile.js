const mongoose = require('mongoose');

const ProfileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    location: {
        type: String
    },
    bio: {
        type: String
    },
    followingList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    followersList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    movieCollections: [
        {
            favorites: {
                type: [String]
            },
            bookmarks: {
                type: [String]
            },
            recommends: {
                type: [String]
            },
        }
    ],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review'
    }],
});

module.exports = mongoose.model('profile', ProfileSchema);