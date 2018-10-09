const express = require('express'),
    path = require('path'),
    auth = require('auth');

const io = require('./io'),
    db = require('./db');

let chat = {};

let __ = require('@opeltre/forest').__;

chat.io = srv => {
    io(srv);
    return chat;
}

chat.app = (view, server) => {
    
    let app = express.Router();
    if (server) io(server);

    app.route('/')
        .get(chat.channel)

    app.route('/t/*')
        .get(view().script('/dist/io.js', 'chat').style('chat'));

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
/*        .parse({
            name: req => req.params[0],
            usr,
            body
        })*/
        .put(req.params[0], usr(req), req.body)
        .then(() => __.logs('user '+ usr(req) + ' posted: ')(req))
        .then(() => res.send('posted'));

chat.channel = 
    (req, res) => res
        .sendFile('/srv/http/mathchat/lib/channels.html');
       
module.exports = chat;
