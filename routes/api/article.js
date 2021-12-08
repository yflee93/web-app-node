const Article = require('../../models/Article');
const Profile = require('../../models/Profile');
const Movie = require('../../models/Movie');
const User = require('../../models/User');

const auth = require("../../middleware/auth");

module.exports = (app) => {
    // only current log in reviewer can post a new article, only movie id is needed.
    // Add to profile and movie model as well.
    app.post('/api/article/:movie_id', auth, async (req, res) => {
        const {movie_id} = req.params;
        const {
            content,
            poster,
            title
        } = req.body;

        try {
            //check uer type first
            const user = await User.findById(req.user.id);
            if (user.type !== 'reviewer') {
                return res.status(401).send('Unauthorized! Reviewer Only');
            }

            let article = new Article({
                title,
                poster,
                content,
                author: req.user.id,
            });

            await article.save();
            await Profile.findOneAndUpdate({user: req.user.id}, {$push: {
                    articles: article.id
                }});
            await Movie.findOneAndUpdate({external_id: movie_id}, {$push: {
                    articles: article.id
                }});

            res.json(article);

        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

    //Admin and author can both delete articles, delete article by id, also remove from
    //movie and profile list.
    app.delete('/api/article/:article_id/:movie_id/:author_id', auth, async (req, res) => {
        try{
        const {article_id, movie_id, author_id} = req.params;
        const currentUser = await User.findById(req.user.id);
        if (currentUser.type !== 'admin' && req.user.id !== author_id) {
                return res.status(401).send(`Delete Article Unauthorized! Admin/Author Only, 
                ${currentUser.type}, ${req.user.id}, ${author_id}`);
            }
        await Profile.findOneAndUpdate({user:author_id}, {$pull: {
                articles: article_id
            }});
        await Movie.findOneAndUpdate({external_id: movie_id}, {$pull: {
                articles: article_id
            }});
        await Article.findByIdAndDelete(article_id);
        res.status(200).send("Article Deleted");}
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    })
}