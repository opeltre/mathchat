// app/index.js 

const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser');

const auth = require('./auth'),
    upload = require('./upload'),
    download = require('./download'),
    view = require('./view'),
    files = require('../rdb/files');

const STATIC = ['../lib','../views', '../static', '../static/webfonts'];

var app = express.Router();

app.use(
    auth.init,
    bodyParser.json(),
    bodyParser.urlencoded({extended:true})
);
app.route('/')
    .get(view.pug('index', req => ({user: req.user})));

/*** /login ***/
app.route('/login*')
    .get(view.html('login'))
    .post(auth.login);

/*** /upload ***/
app.route('/upload')
    .all(auth.check)
    .get(view.pug('upload', {})) 
//    .get(view.html('upload'))
    .post(upload('doc'));

/*** /cloud ***/
app.route('/cloud*')
    //.all(auth.check)
    .get(view.pug('cloud', 
        req => ({user: req.user}),
        req => files.get(req.params[0], req.user)
            .then(a => ({files: a}))
    ));

/*** /files ***/
app.route('/files*')
    .all(auth.check)
    .get(download);

/*** static ***/
STATIC.forEach(dir => app.use(
    dir.replace(/^\W*/,'/'), 
    express.static(path.join(__dirname, dir))
));

module.exports = app;
