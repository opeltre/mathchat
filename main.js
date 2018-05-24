var srv = require('express')(),
    app = require('./app/index.js');

srv.use('/', app(srv.listen(8083)));

