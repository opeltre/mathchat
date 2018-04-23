const r = require('./r');

var db = r.db.table('files');

exports.put = (user, file) => db
    .insert(Object.assign(file, {usr: user.usr}))
    .run(r.cxn)
    .then(res => res.generated_keys[0])
    .catch(console.log);

