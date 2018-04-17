/* ./auth.js

authentication module => passport + express-session
    : app.use(auth.init);
    : app.post('/login', auth.login, ... );
    : app.get('/private', auth.check, ... )
*/

const session = require('express-session'),
    passport = require('passport'),
    localPass = require('passport-local');

const USRDB = {
    oli: {id: "oli", pwd: "peltre"}
}

passport.use(new localPass((usr,pwd,then) => {
    user = USRDB[usr] || false;
    user = user.pwd == pwd ? user : false;
    then(null,user);
}));

passport.serializeUser((user, then) => then(null, user.id));

passport.deserializeUser((id, then) => {
    user = USRDB[id] || false;
    then(null, user);
});

/****  EXPORTS *****/

exports.init = [
    session({
        secret: 'homologique pataphysique',
        resave: true,
        saveUninitialized: true
    }),
    passport.initialize(),
    passport.session()
];

exports.login = passport.authenticate('local');

exports.check = (req, res, next) => req.user
    ? next() 
    : res.redirect('/login');

