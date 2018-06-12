// app/index.js 

const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser');

const auth = require('auth'),
    cloud = require('cloud'),
    chat = require('chat'),
    view = require('view');

module.exports = server => {
    var app = express.Router(),
        index = () => view('index', req => ({user: req.user})),
        STATIC = ['../static', '../lib', 'view/style', 'view/run'];

    app.use(
        auth.init,
        bodyParser.json(),
        bodyParser.urlencoded({extended:true})
    );

    app.route('/')
        .get(index())

    /*** /login ***/
    app.route('/login*')
        .get(view('login'))
        .post(auth.login);

    app.use('/cloud', cloud.app(index));

    app.use('/chat', chat.app(server));

    /*** static ***/
    STATIC.forEach(dir => app.use(
        dir.replace(/^\W*/,'/'), 
        express.static(path.join(__dirname, dir))
    ));
    
    return app;
};
