const session = require('express-session'),
    rDBstore = require('session-rethinkdb')(session),
    r = require('rethinkdbdash')({
        host: 'localhost',
        port: 28019
    });

/**** SESSION STORE ****/

var store = new rDBstore(r, {
    db:     'mathchat',
    table: 'session'
});

module.exports = store;
