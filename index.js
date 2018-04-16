// ./server.js

const STATIC = ['static'];

const fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser'),
    formidable = require('formidable');

var app = express();

// express middleware pour parser le body de requetes http:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//le service statique
//STATIC.forEach((dir) => app.use('/'+dir, express.static(dir)))

//la base de data
//var ls = fs.readdirSync('static'); 
var uploadHTML = fs.readFileSync('upload.html');

// index.html
app.post('/upload', (req, res) => {
    var form = new formidable.IncomingForm();
    form.uploadDir = "tmp";
    form.parse(req, (err,fields,files) => {
        res.end(JSON.stringify({
            fields: fields,
            files: files
        }, null, 1));
    });
});

app.get('/upload', (req, res) => {
    res.end(uploadHTML);
});

////// listen on 80 as root
app.listen(8083);
