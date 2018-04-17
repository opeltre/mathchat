// ./server.js

const STATIC = ['static'];

const fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser'),
    formidable = require('formidable');

const auth = require('./auth')

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

// index.html
app.post('/upload',
    auth.check,
    upload('tmp')
);

app.post('/login',
    auth.login,
    (req,res) => res.end("welcome!")
);

app.get('/login', (req,res) => {
    res.end(loginHTML)
});

app.get('/upload', (req, res) => {
    res.end(uploadHTML);
});

////// listen on 80 as root
app.listen(8083);

function upload(dest) {
    return (req, res) => {
        var form = new formidable.IncomingForm();
        form.uploadDir = dest;
        form.parse(req, (err,fields,files) => {
            res.end(JSON.stringify({
                fields: fields,
                files: files
            }, null, 1));
        });
    }
}


