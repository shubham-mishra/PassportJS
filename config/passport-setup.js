const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const userModel = require('../models/user-model');

passport.serializeUser((user, done) => {
    console.log('reached serialized');
    console.log(user);
    done(null, user[0]._id);
});

passport.deserializeUser((id, done) => {
    
    userModel.findById(id).then((userr) => {
        console.log('reached deserialized');
        done(null, userr);
    })
});

passport.use(
    new GoogleStrategy({
        //options for google strategy
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
        //passport callback function
        //console.log(profile);
        console.log('reached callback')
        userModel.find({googleId: profile.id}).then((currentUser) =>{
            if(currentUser) {
                console.log('user is: '+currentUser);
                done(null, currentUser);
            } else {
                new userModel({
                    username: profile.displayName,
                    googleId: profile.id
                }).save().then((newUser) => {
                    console.log('new user create: '+newUser + newUser.id);
                    done(null, newUser);
                })
            }
        })
      
    })
);