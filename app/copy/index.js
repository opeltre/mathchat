const express = require('express'),
    nodemailer = require('nodemailer'),
    fs = require('fs'),
    path = require('path');

const logthen = x => {console.log(x); return x};

let transport = {
    host: 'ssl0.ovh.net',
    port: 465,
    auth: JSON.parse(fs.readFileSync(path.join(__dirname, './auth.json')))
};

let transporter = nodemailer
    .createTransport(transport);

transporter.verify()
    .then(() => console.log('ready'))
    .catch(console.log);

let mail = {};

mail.app = 
    view => {

        var app = express.Router();
        
        app.route('/')
            .get(view().script('copy').style('copy'));

        app.route('/mailer')
            .post(mail.send);

        return app;
};

mail.send = 
    (req, res) => {
        let msg = mail.messageOptions(req.body);
        console.log(msg);
        transporter.sendMail(msg)
            .then(info => logthen(info))
            .then(info => res.json(info));
    };

mail.messageOptions = 
    ({from, to, subject, parsed}) => ({from, to, subject, html:parsed});

module.exports = mail;
