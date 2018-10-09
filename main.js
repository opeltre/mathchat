let port = 8083
    srv = require('express')(),
    app = require('./app/index.js');

console.log('mathchat @: '+port);

srv.use('/', app(srv.listen(port)));

