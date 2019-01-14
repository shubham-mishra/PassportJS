const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const userModel = require('../models/user-model');

passport.serializeUser((user, done) => {
    // console.log('reached serialized');
    // console.log(user);
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    userModel.findById(id).then((userr) => {
        //console.log('reached deserialized');
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
        // console.log(profile);
        // console.log('reached callback')
        userModel.find({profileId: profile.id}).then((currentUser) =>{
            //console.log('c '+Object.keys(currentUser).length);
            if(Object.keys(currentUser).length > 0) {
                console.log('user is s: '+currentUser);
                done(null, currentUser[0]);
            } else {
                
                new userModel({
                    username: profile.displayName,
                    profileId: profile.id,
                    thumbnail: profile.photos[0].value 
                }).save().then((newUser) => {
                    console.log('new user create: '+newUser + newUser.id);
                    done(null, newUser);
                })
            }
        })
      
    })
);