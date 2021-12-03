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
    movieCollections:
        {
            favorites: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'movie'
                }
            ],
            bookmarks: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'movie'
                }
            ],
            recommends: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'movie'
                }
            ],
        }
});

module.exports = mongoose.model('profile', ProfileSchema);