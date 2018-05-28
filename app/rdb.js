// rdb/r.js
// export rdb connexion + library

const r = require('rethinkdb')

r.cxn = null;

r.connected = r
    .connect({host:'localhost', port:'28019'})
    .then(c => r.cxn = c);

r.db = r.db('mathchat');

module.exports = r;

