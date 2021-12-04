const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const {check, validationResult} = require("express-validator");

const Profile = require('../../models/profile');
const User = require('../../models/User');

module.exports = (app) => {

  // @route ---> GET api/profile
  // @desc  ---> Get current user's profile
  // @access---> Private
  app.get('/api/profile', auth, async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name');

      if(!profile) {
        return res.status(400).json({msg: "There is no profile for this user"});
      }

      res.json(profile);
    } catch(err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  // @route ---> POST api/profile
  // @desc  ---> Create or update user profile
  // @access---> Private
  app.post('/api/profile', auth, async (req, res) => {
    const {
      location,
      bio,
      favorites,
      bookmarks,
      recommends
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;

    // Build following list
    profileFields.followingList = [];
    if (profileFields.user) profileFields.followingList.user = profileFields.user;

    // Build followers list
    profileFields.followersList = [];
    if (profileFields.user) profileFields.followersList.user = profileFields.user;

    // Build movieCollections object
    profileFields.movieCollections = {};
    if (favorites) profileFields.movieCollections.favorites = favorites;
    if (bookmarks) profileFields.movieCollections.bookmarks = bookmarks;
    if (recommends) profileFields.movieCollections.recommends = recommends;

    try {
      let profile = await Profile.findOne({user: req.user.id});

      // if the profile is found, update the profile
      if(profile) {
        //update
        profile = await Profile.findOneAndUpdate(
            {user: req.user.id},
            {$set: profileFields},
            {new: true}
            );
        return res.json(profile);
      }

      // if the profile is not found, create the profile instead
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);

    } catch(err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  // @route ---> GET api/profiles
  // @desc  ---> Get all profiles
  // @access---> Public
  app.get('/api/profiles', async (req,res) => {
    try {
      const profiles = await Profile.find().populate('user', 'name');
      res.json(profiles);

    }catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  })

  // @route ---> GET api/profile/:userId
  // @desc  ---> Get profile by user Id
  // @access---> Public
  app.get('/api/profile/:user_id', async (req,res) => {
    try {
      const profile = await Profile.findOne({user: req.params.user_id}).populate('user', 'name');

      if (!profile)
        return res.status(400).json({msg:'Profile not found'});

      res.json(profile);

    }catch (err) {
      console.error(err.message);
      if(err.kind === 'ObjectId')
        return res.status(400).json({msg:'Profile not found'});
      res.status(500).send('Server Error');
    }
  })
}

