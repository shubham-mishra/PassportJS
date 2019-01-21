const router = require('express').Router();
const passport = require('passport');
const userModel = require('./../models/user-model');
const multer = require('multer');
const fs = require('fs');

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('sdfreac' + __dirname)
        cb(null, 'uploads/')
      },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, req.body.profileId + '.' + file.originalname.split('.')[1] )
    }
});
let upload = multer({storage: multerStorage}).single('profileImage');


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
 })
);

router.post('/localRegister', (req, res) => {
    userModel.find({profileId: profileId}).then((currentUser) => {
        if( Object.keys(currentUser).length > 0 ) {
            res.send('user already exists');
        } else {
            upload(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                  // A Multer error occurred when uploading.
                  console.log(err);
                } else if (err) {
                  // An unknown error occurred when uploading.
                  console.log(err);
                }
                
                // Everything went fine.

                new userModel({
                    username: req.body.userName,
                    profileId: req.body.profileId,
                    thumbnail: 'http://localhost:3001/static/'+req.body.profileId+'.png',
                    password: req.body.password
                }).save().then((newUser) => {
                    req.body.username = req.body.userName;
                    res.redirect('/auth/login');
                }).catch((err) => {
                    res.send('got error while registering user');
                })
              })
        }
    })
    
});

router.get('/check', (req, res) => {
    res.send('http://localhost:3000/uploads/sdf.png');
})
module.exports = router;