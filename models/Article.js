const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    content: {
        type: String
    },
    poster:{
        type: String
    },
    title:{
        type: String
    },
    timestamp: {
        type: Date,
        defaultValue: Date.now
    }
});
module.exports = mongoose.model('article', ArticleSchema);