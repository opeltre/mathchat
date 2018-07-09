// app/index.js 

const express = require('express'),
    path = require('path'),
    fs = require('fs'),
    bodyParser = require('body-parser');

const auth = require('auth'),
    cloud = require('cloud'),
    chat = require('chat'),
    vv = require('view/vv');

const mailer = require('./mailer/index');

module.exports = server => {
    var app = express.Router(),
        STATIC = ['../media', '../lib', '../dist', '../style'];

    app.use(
        auth.init,
        bodyParser.json(),
        bodyParser.urlencoded({extended:true})
    );

    app.route('/')
        .get(vv('index'))

    app.route('/vv')
        .get(
            (req, res) => res
                .sendFile(path.join(__dirname, '../lib/vv-examples/index.html'))
        );

    app.route('/login*')
        .get(vv('login'))
        .post(auth.login);

    app.use('/mail',
        mailer.app(vv('index').clone)
    );

    app.use('/cloud', 
        cloud.app(vv('index').clone)
    );

    app.use('/chat', 
        chat.app(server, vv('index').clone)
    );

    /*** static ***/
    STATIC.forEach(dir => app.use(
        dir.replace(/^\W*/,'/'), 
        express.static(path.join(__dirname, dir))
    ));
    
    return app;
};
