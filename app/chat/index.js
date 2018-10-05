const express = require('express'),
    path = require('path'),
    auth = require('auth');

const io = require('./io'),
    db = require('./db');

let chat = {};

chat.app = (view, server) => {
    
    let app = express.Router();
    if (server) io(server);

    app.route('/')
        .get(chat.channel)

    app.route('/t/*')
        .get(view().script('chat').style('chat'));

    app.route('/ajax/*')
        .get(chat.get)
        .post(
            auth.check,
            chat.post
        );

    return app;
}

let usr = 
    req => req.user ? req.user.usr : 'public'; 

chat.get = 
    (req, res) => db
        .get(req.params[0])
        .then(msgs => res.json(msgs));

chat.post = 
    (req, res) => db
        .put(req.params[0], usr(req), req.body)
        .then(() => res.send('posted'));

chat.channel = 
    (req, res) => res
        .sendFile('/srv/http/mathchat/lib/channels.html');

chat.listen = io; // chat.listen(server);
       
module.exports = chat;
