const express = require('express');
const app = express();
const parser = require('body-parser');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');

//set view engine
app.set('view engine', 'ejs');

app.use(parser.urlencoded({ extended: true }));

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//connect to mongodb
mongoose.connect(keys.mongodb.dbURI, () => {
    console.log("connected to mongodb");
});

//serving static files, user images
app.use('/static',express.static(__dirname+'/uploads'));

//set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
    res.render("home", {user: req.user});
});

app.listen(3001, () => {
    console.log('app listening on 3001');
});

