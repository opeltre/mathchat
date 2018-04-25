// app/view.js
// just send the html...

const path = require('path'),
    pug = require('pug');

const dir = path.join(__dirname, '../views');

exports.html = (name) => 
    (req, res) => res.sendFile(path.join(dir, name + '.html'));

exports.pug = (name, promise) =>
    (req, res) => promise(req)
        .then(data => res.send(pug.renderFile(
            path.join(dir, name + '.pug'),
            data
        )))
        .catch(console.log);
