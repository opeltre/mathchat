// ./server.js

const fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser');

const auth = require('./auth'),
    upload = require('./upload');

const STATIC = ['static','tmp'],
    uploadHTML = fs.readFileSync('upload.html'),
    loginHTML = fs.readFileSync('login.html');

var app = express();
app.use(auth.init);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

/*** static ***/
STATIC.forEach((dir) => app.use('/'+dir, express.static(dir)))

/*** /login ***/
app.get('/login', (req,res) => {
    res.end(loginHTML)
});
app.post('/login',
    auth.login,
    (req,res) => res.redirect('/upload')
);

/*** /upload ***/
app.get('/upload', (req, res) => {
    auth.check,
    res.end(uploadHTML);
});
app.post('/upload',
    auth.check,
    upload('tmp')
);

/*** 80 as root ***/
app.listen(8083);

