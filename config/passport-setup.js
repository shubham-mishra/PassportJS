const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const keys = require('./keys');
const userModel = require('../models/user-model');

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    userModel.findById(id).then((userr) => {
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
        userModel.find({profileId: profile.id}).then((currentUser) =>{
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

passport.use(new FacebookStrategy({
        clientID: keys.facebook.app_id,
        clientSecret: keys.facebook.app_secret,
        callbackURL: '/auth/facebook/redirect',
        profileFields: ['emails', 'first_name', 'middle_name', 'last_name',]
    },
    function(accessToken, refreshToken, profile, done) {
        

        let imgUrl = 'https://graph.facebook.com/'+profile.id+'/picture?width=200&height=200&access_token='+accessToken;
        userModel.find({profileId: profile.id}).then((currentUser) => {
            if(Object.keys(currentUser).length > 0) {
                done(null, currentUser[0]);
            } else {
                new userModel({
                    profileId: profile.id,
                    username: profile.name.givenName +' '+profile.name.familyName,
                    thumbnail: imgUrl
                }).save().then((newUser) =>{
                    done(null, newUser);
                });
            }
        });
    })
);

passport.use(new GithubStrategy({
        clientID: keys.github.clientID,
        clientSecret: keys.github.clientSecret,
        callbackURL: 'http://localhost:3001/auth/github/redirect'
    },
    (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        userModel.find({profileId: profile.id}).then((currentUser) => {
            if(Object.keys(currentUser).length > 0) {
                done(null, currentUser[0]);
            } else {
                new userModel({
                    profileId: profile.id,
                    username: profile.displayName,
                    thumbnail: profile.photos[0].value
                }).save().then((newUser) => {
                    done(null, newUser);
                });
            }
        });
    })
)