const router = require('express').Router();

const authCheck = (req, res, next) => {
    if (!req.user) {
        setTimeout(() => {console.log('hello')}, 5000);
        res.redirect('/auth/login');
    } else {
        next();
    }
}
router.get('/', authCheck, (req, res) => {
    res.send('your profile is '+ req.user.username);
});

module.exports = router;