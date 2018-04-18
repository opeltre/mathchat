const r = require('rethinkdb');

var cxn = null;
r.connect({host:'localhost', port:'28019'})
    .then(c => cxn = c);

var db = r.db('mathchat').table('usr');

exports.login = (usr,pwd,then) => db
    .get(usr)
    .run(cxn)
    .then(u => u.pwd == pwd ? u : false)
    .catch(console.log);

exports.get = (usr) => db
    .get(usr)
    .run(cxn)
    .catch(console.log);

