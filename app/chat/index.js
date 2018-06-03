const express = require('express'),
    path = require('path'),
    auth = require('auth'),
    view = require('view');

const io = require('./io'),
    db = require('./db');

var chat = {};

chat.app = (index, server) => {
    
    io(server);
    
    var app = express.Router();
    
    app.route('/*')
        .get(chat.get(index))
        .post(
            auth.check,
            chat.post
        )

    return app;
}

const usr = req => req.user ? req.user.usr : 'public'; 

chat.listen = io;

chat.view = view('chat')
    .use(req => db.get(req.params[0]))

const logthen = x => {console.log(x) ; return x}

chat.roomView = view('rooms')
    .use(req => db.getChannels(usr(req)).then(logthen))

chat.get = index => index()
    .include('win', chat.view)
    .catch(index()
        .include('win', chat.roomView)
        .catch(console.log)
    );

chat.post = (req, res) => db
        .put(req.params[0], usr(req), req.body)
        .then(() => res.send('posted'));

module.exports = chat;

/*
chat.view = index()
    .include('win',
        view('chat').use(req => db.get(req.params[0]))
    )
    .catch(index().include('win',
        view('rooms').use(req => db.getChannels(req.user.usr))
    );
*/
