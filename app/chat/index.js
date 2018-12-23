let express = require('express'),
    path = require('path'),
    auth = require('auth');

let io = require('./io'),
    db = require('./db'),
    fst = require('../../dist/fst'),
    __ = require('@opeltre/forest').__;

exports.listen = io;

exports.app = 

    doc => {
    
        let app = express.Router();

        app.route('/')
            .get(getIndex(doc))

        app.route('/t/*')
            .get(doc()
                .script('/dist/io.js', 'chat/index', 'chat/view')
                .style('chat')
            );

        return app;
    };

let usr = 
    req => req.user ? req.user.usr : 'public'; 

let getIndex = doc => 
    doc().use(
        fst('a', {href: '/chat/t/0'}, ['room a']),
        fst('a', {href: '/chat/t/1'}, ['room b'])
    )
