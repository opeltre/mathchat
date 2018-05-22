/* ./auth.js
  
authentication module => passport + express-session

usage:
    : app.use(auth.init);
    : app.post('/login', auth.login, ... );
    : app.get('/private', auth.check, ... )
*/

const session = require('express-session'),
    passport = require('passport'),
    localPass = require('passport-local');

const db = require('./usr');

/**** PASSPORT.CONF ****/

/* promise wrap */
const donethen = (promise, done) => promise
        .then(out => done(null, out))
        .catch(err => done(err, false));
/* authentication */
passport.use(new localPass(
    (usr, pwd, done) => donethen(db.login(usr, pwd),done)
));
/* session */
passport.serializeUser((user, done) => done(null, user.usr))
passport.deserializeUser((usr, done) => donethen(db.get(usr), done));

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

exports.login = [
    passport.authenticate('local'),
    (req, res) => res.redirect(req.path.replace(/^\/login/, ''))
];

exports.check = (req, res, next) => req.user
    ? next() 
    : res.redirect('/login' + req.path);
