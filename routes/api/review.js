const Review = require('../../models/review');
const Profile = require('../../models/profile');

const auth = require("../../middleware/auth");

module.exports = (app) => {
    app.post('/api/review/:movie_id', auth, async (req, res) => {
        const {movie_id} = req.params;
        const {
            content,
            rating,
            poster,
            title
        } = req.body;

        try {
            let review = new Review({
                title,
                poster,
                rating,
                content,
                author: req.user.id,
            });

            await review.save();
            await Profile.findOneAndUpdate({user: req.user.id}, {$push: {
                reviews: review.id
                }});


            res.json(review);

        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });
}