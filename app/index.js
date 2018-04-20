// ./server.js

const fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser');

const auth = require('./auth'),
    upload = require('./upload');

const STATIC = ['static','tmp'],
    uploadHTML = fs.readFileSync('static/upload.html'),
    loginHTML = fs.readFileSync('static/login.html');

var app = express();

app.use(
    auth.init,
    bodyParser.json(),
    bodyParser.urlencoded({extended:true})
);

/*** static ***/
STATIC.forEach((dir) => app.use('/'+dir, express.static(dir)))

/*** /login ***/
app.route('/login*')
    .get(
        (req,res) => res.end(loginHTML)
    )
    .post(
        auth.login,
    );

/*** /upload ***/
app.route('/upload')
    .all(auth.check)
    .get(
        (req,res) => res.end(uploadHTML)
    )
    .post(
        upload('doc'),
        (req,res) => res.json(req.file)
    );

/*** 80 as root ***/
app.listen(8083);

