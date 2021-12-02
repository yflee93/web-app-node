const auth = require("../../middleware/auth");
const User = require("../../models/User");

const { check, validationResult } = require('express-validator');
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = config.get("jwtSecret");

module.exports = (app) => {
    //Get current user
    app.get("/api/auth", auth, async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            res.json(user);
        }
        catch(err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });

    //Login User
    app.post('/api/auth', [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password cannot be empty').notEmpty()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {email, password} = req.body;

        try {
            let user = await User.findOne({email});
            if (!user) {
                return res.status(400).json({ errors: [{msg: 'Invalid credentials'}]});
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ errors: [{msg: 'Invalid credentials'}]});
            }

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
}