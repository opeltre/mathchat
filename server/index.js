// ./server.js

const express = require('express'),
    bodyParser = require('body-parser');

const auth = require('./auth'),
    upload = require('./upload'),
    view = require('./view');

var app = express();

app.use(
    auth.init,
    bodyParser.json(),
    bodyParser.urlencoded({extended:true})
);

/*** /login ***/
app.route('/login*')
    .get(
        view.html('login')
    )
    .post(
        auth.login
    );

/*** /upload ***/
app.route('/upload')
    .all(auth.check)
    .get(
        view.html('upload')
    )
    .post(
        upload('doc'),
        (req,res) => res.json(req.file)
    );

/*** 80 as root ***/
app.listen(8083);

