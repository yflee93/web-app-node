const mongoose = require('mongoose');

const MovieSchema = mongoose.Schema({
    // external_id: {
    //     type: String,
    //     required: true
    // },
    movieName: {
        type: String
    },
    rating: {
        type: Number
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review',
    }],
    articles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'article',
    }],
    originalId: {
        type: Number
    }
});

module.exports = mongoose.model('movie', MovieSchema);