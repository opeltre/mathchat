// app/index.js 

const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser');

const auth = require('./auth'),
    upload = require('./upload'),
    download = require('./download'),
    view = require('./view'),
    files = require('../rdb/files');

const STATIC = ['../lib','../views'];

var app = express();

app.use(
    auth.init,
    bodyParser.json(),
    bodyParser.urlencoded({extended:true})
);

/*** /login ***/
app.route('/login*')
    .get(view.html('login'))
    .post(auth.login);

/*** /upload ***/
app.route('/upload')
    .all(auth.check)
    .get(view.html('upload'))
    .post(upload('doc'));

/*** /cloud ***/
app.route('/cloud*')
    .all(auth.check)
    .get(view.pug('cloud', req => files.get(req.params[0], req.user)));

/*** /files ***/
app.route('/files*')
    .all(auth.check)
    .get(download);

/*** static ***/
STATIC.forEach(dir => app.use(
    dir.replace(/^\W*/,'/'), 
    express.static(path.join(__dirname, dir))
));

/*** 80 as root ***/
app.listen(8083);
