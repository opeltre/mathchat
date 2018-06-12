const express = require('express'),
    path = require('path'),
    auth = require('auth'),
    view = require('view');

const io = require('./io'),
    db = require('./db');

var chat = {};

chat.app = (server) => {
    
    io(server);
    var app = express.Router();

    app.route('/ajax/*')
        .get(chat.get)
        .post(
            auth.check,
            chat.post
        );

    app.route('/t/*')
        .get(chat.talk);

    return app;
}

const usr = req => req.user ? req.user.usr : 'public'; 
const logthen = x => {console.log(x); return x}

chat.listen = io;

chat.get = 
    (req, res) => db
        .get(req.params[0])
        .then(logthen)
        .then(msgs => res.json(msgs));

chat.post = 
    (req, res) => db
        .put(req.params[0], usr(req), req.body)
        .then(() => res.send('posted'));

chat.talk = 
    (req, res) => {
        console.log('talk at: '+req.params[0]);
        res.sendFile('/srv/http/mathchat/lib/chat.html');
    }

chat.channel = 
    (req, res) => res
        .sendFile('/srv/http/mathchat/lib/channels.html');
       
module.exports = chat;
