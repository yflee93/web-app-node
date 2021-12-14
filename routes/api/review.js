const Review = require('../../models/Review');
const Profile = require('../../models/Profile');
const Movie = require('../../models/Movie');
const User = require('../../models/User');

const auth = require("../../middleware/auth");

module.exports = (app) => {
    // only current log in user can post a new review, only movie id is needed.
    // Add to profile and movie model as well.
    app.post('/api/review/:movie_id', auth, async (req, res) => {
        const {movie_id} = req.params;
        const {
            content,
            rating,
            poster,
            title,
            movieName,
            movieRating
        } = req.body;

        try {
            let review = new Review({
                title,
                poster,
                rating,
                content,
                author: req.user.id,
                originalId: movie_id
            });

            await review.save();
            await Profile.findOneAndUpdate({user: req.user.id}, {$push: {
                    reviews: review.id
                }});
            let curMovie = await Movie.findOne({originalId: movie_id});
            if (curMovie) {
                await Movie.findOneAndUpdate({originalId: movie_id}, {$push: {
                        reviews: review.id
                    }});
            }
            else {
                let newMovie = new Movie({
                    movieName: movieName,
                    rating: movieRating,
                    reviews: [review.id],
                    articles: [],
                    originalId: movie_id
                });
                await newMovie.save();
            }

            res.json(review);

        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

    //Admin and author can both delete reviews, delete review by id, also remove from
    //movie and profile list.
    app.delete('/api/review/:review_id/:movie_id/:author_id', auth, async (req, res) => {
        try {
            const {review_id, movie_id, author_id} = req.params;
            const currentUser = await User.findById(req.user.id);
            // console.log(currentUser);
            if (currentUser.type !== 'admin' && req.user.id !== author_id) {
                return res.status(401).send(`Delete Review Unauthorized! Admin/Author Only,
                ${currentUser.type}, ${req.user.id}, ${author_id}`);
            }

            await Profile.findOneAndUpdate({user: author_id}, {
                $pull: {
                    reviews: review_id
                }
            });
            await Movie.findOneAndUpdate({originalId: movie_id}, {$pull: {
                    reviews: review_id
                }});
            await Review.findByIdAndDelete(review_id);
            res.status(200).send("Review Deleted");
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

    app.get('/api/review/:movie_id', async (req, res) => {
        const {movie_id} = req.params;
        try {
            let reviews = [];
            // console.log(movie_id);
            let reviewIds = await Movie.findOne({originalId: movie_id}).select({reviews: 1, _id: 0}).
            then((reviewObj) => {
                if (reviewObj) {
                    return reviewObj.reviews;
                }
                else return [];
            });
            // let reviewIds = await Movie.findOne({movieName: 'Saw II'});
            for (const reviewId of reviewIds) {
                let curReview = await Review.findOne({_id: reviewId});
                // console.log("curReview:");
                // console.log(curReview);
                reviews.push(curReview);
            }
            // console.log("reviewIds:");
            // console.log(reviewIds);
            // console.log("reviews:");
            // console.log(reviews);
            res.json(reviews);
        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });
}