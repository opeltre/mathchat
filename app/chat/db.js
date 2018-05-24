const r = require('../rdb.js'),
    db = r.db.table('chat');

const message = (msg, usr) => Object.assign(msg, {
    date: Date(),
    usr: usr
});

exports.put = (id, usr, msg) => db
    .get(id)
    .update(
        r => ({ msgs : r('msgs').append(message(msg, usr)) })
    )
    .run(r.cxn)

exports.get = (id, user) => db
    .get(id)
    .pluck('msgs')
    .run(r.cxn)

