const jwt = require("jsonwebtoken");
const config = require("config");

const jwtSecret = config.get('jwtSecret');

module.exports = (req, res, next) => {
    //Get token from header
    const token = req.header('x-auth-token');

    //Check if no token
    if (!token) {
        return res.status(401).json({msg: 'no token, authorization denied'});
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded.user;
        next();
    }
    catch(err) {
        res.status(401).json({msg: "token not valid"});
    }
}