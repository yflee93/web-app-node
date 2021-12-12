const mongoose = require('mongoose');

const MovieSchema = mongoose.Schema({
  originalId:{
    type: Number
  },
  movieName: {
    type: String
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