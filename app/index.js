// app/index.js 
let conf = require('./conf');

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


module.exports =
    
    server => {

        let app = express.Router();

        chat.listen(server);

        return __.do(
            Requests,
            Routes,
            Statique
        )(app);

    };


let doc = 
    html => fst.doc('view/' + (html || 'index'))
        .script(...conf.scripts)
        .style(...conf.sheets);


function Routes (app) {

        app.route('/')
            .get(doc('index').style('cloud'));

        app.route('/login*')
            .get(doc('login').style('login'))
            .post(auth.login);

        app.use('/cloud', cloud.app(doc));

        app.use('/mail', mailer.app(doc));

        app.use('/chat', chat.app(doc));
}


function Statique (app) {

    conf.statique.forEach(
        dir => app.use(
            dir.replace(/^\W*/,'/'), 
            express.static(path.join(__dirname, dir))
        )
    );
}

function Requests (app) {

    app.use(
        auth.init, 
        bodyParser.json(),
        bodyParser.urlencoded({extended: true})
    );
}
