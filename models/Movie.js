const mongoose = require('mongoose');

const MovieSchema = mongoose.Schema({
    external_id: {
        type: String,
        required: true
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

module.exports = mongoose.model('movie', MovieSchema);