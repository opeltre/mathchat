// app/index.js 
let express = require('express'),
    path = require('path'),
    fs = require('fs'),
    bodyParser = require('body-parser');

let auth = require('auth'),
    cloud = require('cloud'),
    chat = require('chat'),
    fst = require('@opeltre/forest');

let statique = [
    '../media', '../lib', '../dist', '../style'
];
let scripts = [
    'forest', 'mdtex'
];
let sheets = [
    'main', 'fonts'
];
let doc = 
    html => fst.doc('view/' + (html || 'index'))
        .script(...scripts)
        .style(...sheets);


module.exports = server => {
    let app = express.Router();
    return __.do(
        Parse,
        Routes,
        Statique
    )(app);
}


function Routes (app) {

    app.route('/')
        .get(doc('index').style('cloud'));

    app.route('/login*')
        .get(doc('login').style('login'));
        .post(auth.login);

    app.use('/cloud', cloud.app(doc));
    app.use('/mail', mailer.app(doc));
    app.use('/chat', chat.app(doc).listen(server));
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

