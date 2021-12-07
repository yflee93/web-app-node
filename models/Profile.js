const mongoose = require('mongoose');

const ProfileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    avatar: {
        type: String
    },
    location: {
        type: String
    },
    bio: {
        type: String
    },
    movieCollections:
        {
            favorites: [Number],
            bookmarks: [Number],
            recommends: [Number],
        },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review'
    }],
    articles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'article'
    }]
});

module.exports = mongoose.model('profile', ProfileSchema);