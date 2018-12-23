let express = require('express'),
    path = require('path'),
    auth = require('auth');

let io = require('./io'),
    db = require('./db'),
    fst = require('../../dist/fst'),
    __ = require('@opeltre/forest').__;

exports.listen = io;

exports.app = 

    view => {
    
        let app = express.Router();

        app.route('/')
            .get(getIndex(view))

        app.route('/t/*')
            .get(view()
                .script('/dist/io.js', 'chat')
                .style('chat')
            );

        return app;
    };

let usr = 
    req => req.user ? req.user.usr : 'public'; 

let getIndex = view => 
    view().use(
        fst('a', {href: '/chat/t/0'}, ['room a']),
        fst('a', {href: '/chat/t/1'}, ['room b'])
    )
