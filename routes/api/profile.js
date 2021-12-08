const auth = require("../../middleware/auth");
const Profile = require('../../models/Profile');
const User = require("../../models/User");
const {AvatarGenerator} = require("random-avatar-generator");

const generator = new AvatarGenerator();

module.exports = (app) => {
    // @route ---> GET api/profile
    // @desc  ---> Get current user's profile
    // @access---> Private
    app.get('/api/profile', auth, async (req, res) => {
        try {
            const profile =
                await Profile.findOne({ user: req.user.id })
                    .populate('user', 'name')
                    .populate('reviews')
                    .populate('articles');
            res.json(profile);
        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

    // @route ---> POST api/profile
    // @desc  ---> Create (if null) or update (existing) user profile (only bio & location)
    // @access---> Private
    app.post('/api/profile', auth, async (req, res) => {
        const {
            name,
            location,
            bio,
        } = req.body;

        try {
            let profile = await Profile.findOne({user: req.user.id}).populate('user', 'name');
            // if the profile is found, update the profile
            if(profile) {
                await User.findByIdAndUpdate(req.user.id, {$set: {name}})
                profile = await Profile.findOneAndUpdate(
                    {user: req.user.id},
                    {$set: {location: location, bio:bio}},
                    {new: true}
                ).populate('user', 'name');
                return res.json(profile);
            }

            // if the profile is not found, create the profile instead
            profile = new Profile();
            profile.user = req.user.id;
            profile.avatar = generator.generateRandomAvatar();
            profile.location = location;
            profile.bio = bio;
            profile.reviews = [];
            profile.articles = [];
            const newMovieCollections = {};
            newMovieCollections.favorites = [];
            newMovieCollections.bookmarks = [];
            newMovieCollections.recommends = [];
            profile.movieCollections = newMovieCollections;
            await User.findByIdAndUpdate(req.user.id, {$set: {name}});
            await profile.save();
            profile = await Profile.findOne({user: req.user.id}).populate('user', 'name');
            res.json(profile);

        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });


    // @route ---> GET api/profile/:userId
    // @desc  ---> Get profile by user Id
    // @access---> Public
    app.get('/api/profile/:user_id', async (req,res) => {
        try {
            const profile = await Profile.findOne({user: req.params.user_id})
                .populate('user', 'name')
                .populate('reviews')
                .populate('articles');;
            res.json(profile);
        }catch (err) {
            console.error(err.message);
            if(err.kind === 'ObjectId')
                return res.status(400).json({msg:'Profile not found'});
            res.status(500).send('Server Error');
        }
    })

    // @route ---> DELETE /api/profile/:movie_id/:collection
    // @desc  ---> Remove a collection item from movieCollections in a profile
    // @access---> Private
    app.delete("/api/profile/:movie_id/:collection", auth, async(req , res)=> {
        try {
            const {movie_id, collection} = req.params;
            let profile = await Profile.findOne({user:req.user.id});
            let {favorites, bookmarks, recommends} = {...profile.movieCollections};
            switch (collection) {
                case "favorite":
                    favorites = favorites.filter(favorite => favorite.toString() !== movie_id);
                    break;
                case "bookmark":
                    bookmarks = bookmarks.filter(bookmark => bookmark.toString() !== movie_id);
                    break;
                case "recommend":
                    recommends = recommends.filter(recommend => recommend.toString() !== movie_id);
                    break;
                default:
                    break;
            }
            let new_collection = {
                favorites, bookmarks, recommends
            }
            const new_profile = await Profile.findOneAndUpdate({user:req.user.id}, {$set: {
                movieCollections: new_collection
                }}, {new: true}).populate('user', 'name');
            res.json(new_profile);
        }
        catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    })

}