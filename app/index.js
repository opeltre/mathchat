// app/index.js 
let express = require('express'),
    path = require('path'),
    fs = require('fs'),
    bodyParser = require('body-parser');

let auth = require('auth'),
    cloud = require('cloud'),
    chat = require('chat'),
    mailer = require('mailer'),
    fst = require('../dist/fst').cd(__dirname),
    __ = fst.__;


let statique = [
    '../media', '../lib', '../dist', '../style'
];
let scripts = [
    '/dist/fst/bundle.js', 'mdtex', 'mathjaxConf',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js'
];
let sheets = [
    'main', 'fonts',
    '/media/fa/fontawesome-all.css'
];
let doc = 
    html => fst.doc('view/' + (html || 'index'))
        .script(...scripts)
        .style(...sheets);


module.exports = server => {
    let app = express.Router();
    return __.do(
        Parse,
        Routes(server),
        Statique
    )(app);
}


function Routes (server) {

    return (app) => {

        app.route('/')
            .get(doc('index').style('cloud'));

        app.route('/login*')
            .get(doc('login').style('login'))
            .post(auth.login);

        app.use('/cloud', cloud.app(doc));
        app.use('/mail', mailer.app(doc));
        app.use('/chat', chat.io(server).app(doc));
    }
}


function Statique (app, S=statique) {
    S.forEach(dir => app.use(
        dir.replace(/^\W*/,'/'), 
        express.static(path.join(__dirname, dir))
    ));
}

function Parse (app) {
    app.use(
        auth.init, 
        bodyParser.json(),
        bodyParser.urlencoded({extended: true})
    );
}
