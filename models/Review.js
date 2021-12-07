const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    content: {
        type: String
    },
    rating: {
        type: Number
    },
    poster:{
        type: String
    },
    title:{
        type: String
    }
});
module.exports = mongoose.model('review', ReviewSchema);