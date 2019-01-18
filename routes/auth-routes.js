const router = require('express').Router();
const passport = require('passport');
const userModel = require('./../models/user-model');

//auth login
router.get('/login', (req, res) => {
    res.render('login', {user: req.user});
});

//auth logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

//auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));

//calback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile/');
});


//auth with facebook
router.get('/facebook', passport.authenticate('facebook', {
    scope : ['public_profile', 'email']
}));

//callback route for facebook to redirect to
router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
    console.log('reached callback');
    res.redirect('/profile/')
})


//auth with github
router.get('/github', passport.authenticate('github', {
    scope:['email']
}));

//callback route for github to redirect to
router.get('/github/redirect', passport.authenticate('github'), (req, res) => {
    res.redirect('/profile/');
});

//auth with local strategy
router.post('/localLogin', passport.authenticate('local', { successRedirect: '/',
    failureRedirect: '/auth/login'
 }),  (req, res) => {
    console.log('reach');
    res.send('reqached login');
});

router.post('/localRegister', (req, res) => {
    let profileId = res.body.profile-id;
    userModel.find({profileId: profileId}).then((currentUser) => {
        if( Object.keys(currentUser).length > 0 ) {
            res.send('user already exists');
        } else {
            new userModel({
                profileId: profileId,
                username: res.body.user-name,
                password: res.body.password,
                
            })
        }
    })
    
})
module.exports = router;