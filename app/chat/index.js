const express = require('express'),
    path = require('path'),
    auth = require('auth'),
    view = require('view');

const io = require('./io'),
    db = require('./db');

var chat = {};


chat.listen = io;

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


chat.view = view('chat')
    .use(req => db.get(req.params[0]))

chat.roomView = view('x')
    .use(req => ({x : 'pas de salon '+ req.params[0]}));


chat.get = index => index()
    .include('win', chat.view)
    .catch(index().include('win', chat.roomView));

chat.post = (req, res) => db
        .put(req.params[0], req.user.usr, req.body)
        .then(() => res.send('posted'));

module.exports = chat;
