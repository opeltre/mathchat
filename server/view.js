// app/view.js
// just send the html...

const path = require('path');

const dir = path.join(__dirname, '../front/views');

exports.html = name => 
    (req, res) => res.sendFile(path.join(dir, name + '.html'));
