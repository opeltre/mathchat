const express = require('express'),
    path = require('path'),
    auth = require('auth'),
    view = require('view');

const db = require('./db');

var chat = {};

chat.view = view('chat', 
    req => db.get(0)
);

chat.app = (index, io) => {
    var app = express.Router();
    
    app.route('/')
        .get(index().include('win', chat.view))
        .post(
            auth.check,
            chat.post
        )

    return app;
}

chat.post = (req, res) => db
    .put(0, req.user.usr, req.body)
    .then(() => res.send('posted'));
    

module.exports = chat;
