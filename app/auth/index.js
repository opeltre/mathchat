/* ./auth.js
  
authentication module => passport + express-session

usage:
    : app.use(auth.init);
    : app.post('/login', auth.login, ... );
    : app.get('/private', auth.check, ... )

    : io.use(auth.io);
*/

const session = require('express-session'),
    cookie = require('cookie-parser'),
    passport = require('passport'),
    localPass = require('passport-local'),
    passportio = require('passport.socketio');

const db = require('./usr'),
    store = require('./session');

const secret = 'homologique pataphysique',
    key = 'express.sid';

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
        key: key,
        secret: secret,
        resave: true,
        saveUninitialized: true,
        store: store
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

exports.io = passportio.authorize({
    cookieParser: cookie,
    key: key,
    secret: secret,
    store : store 
});

