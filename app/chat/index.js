const express = require('express'),
    path = require('path'),
    auth = require('auth');

const io = require('./io'),
    db = require('./db');

var chat = {};

chat.app = (server, view) => {
    
    io(server);
    var app = express.Router();

    app.route('/ajax/*')
        .get(chat.get)
        .post(
            auth.check,
            chat.post
        );

    app.route('/t/*')
        .get(chat.talk(view));

    return app;
}

const usr = req => req.user ? req.user.usr : 'public'; 
const logthen = x => {console.log(x); return x}

chat.listen = io;

chat.get = 
    (req, res) => db
        .get(req.params[0])
        .then(msgs => res.json(msgs));

chat.post = 
    (req, res) => db
        .put(req.params[0], usr(req), req.body)
        .then(() => res.send('posted'));

chat.talk = 
    view => view()
        .script('chat')
        .style('chat');

chat.channel = 
    (req, res) => res
        .sendFile('/srv/http/mathchat/lib/channels.html');
       
module.exports = chat;
