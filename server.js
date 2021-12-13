const express = require("express");
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const app = express();

//CORS Policy
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, x-auth-token, Accept");
    res.header("Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

//connect MongoDB atlas
connectDB();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=> console.log(`listen now on ${PORT}`));

require('./routes/api/users')(app);
require('./routes/api/auth')(app);
require('./routes/api/profile')(app);
require('./routes/api/review')(app);
require('./routes/api/article')(app);
require('./routes/api/search')(app);