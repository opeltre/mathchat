// /rdb/usr.js 
// user credentials --> promises

const r = require('../rdb.js');

var db = r.db.table('usr');

exports.login = (usr,pwd) => db
    .get(usr)
    .do(u => r.branch(u('pwd').eq(pwd), u, false))
    .run(r.cxn)
    .catch(console.log);

exports.get = (usr) => db
    .get(usr)
    .run(r.cxn)
    .catch(console.log);

