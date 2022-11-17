// import all important packages
require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');


// custom imports
const postRoutes = require('./api/post.routes');
const authPostRoutes = require('./api/auth-post.routes');
const authRoutes = require('./api/auth-user.routes');


// initialise express app
const app = express();

// set middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// connect to mongodb using mongoose
const port = process.env.PORT || 8800;

mongoose.connect(process.env.MONGODB_URI).then(() => {
    // listen to port
    app.listen(port, () => console.log(`Connected to DB and app on port ${port}`));

}).catch(err => console.log(err.message));


// setting routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/auth/posts', authPostRoutes);
app.use('*', (req, res) => res.redirect('/'));


module.exports = app;