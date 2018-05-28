const r = require('../rdb.js'),
    db = r.db.table('chat');

const stamp = (msg, usr) => Object.assign(msg, {
    date: Date(),
    usr: usr
});

const onchange = (id, listener) => db
    .get(id)
    .changes()
    .run(r.cxn)
    .then(cursor => cursor.each(
        (err, x) => listener(x)
    ));

exports.put = (id, usr, msg) => db
    .get(id)
    .update(
        r => ({ msgs : r('msgs').append(stamp(msg, usr)) })
    )
    .run(r.cxn);

exports.get = (id, user) => db
    .get(id)
    .pluck('msgs')
    .run(r.cxn);

exports.change = (id, listener) => r
    .connected
    .then(() => onchange(id, listener));
    
