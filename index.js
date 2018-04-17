// ./server.js

const STATIC = ['static'];

const fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser');

const auth = require('./auth'),
    upload = require('./upload');

var app = express();
app.use(auth.init);

// express middleware pour parser le body de requetes http:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//le service statique
//STATIC.forEach((dir) => app.use('/'+dir, express.static(dir)))

//la base de data
//var ls = fs.readdirSync('static'); 
var uploadHTML = fs.readFileSync('upload.html');
var loginHTML = fs.readFileSync('login.html');

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

