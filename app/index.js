// app/index.js 

const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser');

const auth = require('auth'),
    cloud = require('cloud'),
    view = require('view');

var app = express.Router(),
    index = view('index', req => ({user: req.user})),
    STATIC = ['../static', 'view/style'];

app.use(
    auth.init,
    bodyParser.json(),
    bodyParser.urlencoded({extended:true})
);

app.route('/')
    .get(index)

/*** /login ***/
app.route('/login*')
    .get(view('login'))
    .post(auth.login);

app.use('/cloud', cloud.app(index));

/*** static ***/
STATIC.forEach(dir => app.use(
    dir.replace(/^\W*/,'/'), 
    express.static(path.join(__dirname, dir))
));

module.exports = app;
