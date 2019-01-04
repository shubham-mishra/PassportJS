const app = require('express')();
const authRoutes = require('./routes/auth-routes');
const passportSetup = require('./config/passport-setup');

app.set('view engine', 'ejs');

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.render("home");
});

app.listen(3001, () => {
    console.log('app listening on 3001');
});

