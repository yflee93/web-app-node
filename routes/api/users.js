const { check, validationResult } = require('express-validator');
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require('../../models/User');

const adminCode = config.get("adminCode");
const reviewerCode = config.get("reviewerCode");
const jwtSecret = config.get("jwtSecret");

module.exports = (app) => {
    //Register User
    app.post('/api/users', [
        check('name', 'Name is required').notEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password cannot be empty').notEmpty()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {name, email, password, type, code} = req.body;

        if (type !== 'general' && type !== 'admin' && type !== 'reviewer') {
            return res.status(400).json({ errors: [{msg: 'Wrong user type'}]});
        }
        switch (type) {
            case 'admin':
                if (code !== adminCode) {
                    return res.status(400).json({ errors: [{msg: 'Verification failed'}]});}
                break;
            case 'reviewer':
                if (code !== reviewerCode) {
                    return res.status(400).json({ errors: [{msg: 'Verification failed'}]});}
                break;
            default:
                break;
        }

        try {
            let user = await User.findOne({email});
            if (user) {
                return res.status(400).json({ errors: [{msg: 'User Already exists'}]});
            }

            user = new User({
                name, email, password, type
            });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload, jwtSecret, {expiresIn: 360000},
                (err, token) => {
                if(err) throw err;
                res.json(token);
                });

        }
        catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    })
};