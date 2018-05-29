const r = require('../rdb.js'),
    db = r.db.table('chat');

const stamp = (msg, usr) => Object.assign(msg, {
    date: Date(),
    usr: usr
});

exports.put = (id, usr, msg) => db
    .get(id)
    .update(
        r => ({ msgs : r('msgs').append(stamp(msg, usr)) })
    )
    .run(r.cxn);

exports.get = (id, user) => db
    .get(id)
    .pluck('msgs')
    .run(r.cxn)

const getChannels = () => db
    .pluck('id')
    .run(r.cxn)
    .then(c => c.toArray());

exports.getChannels = () => r.connected
    .then(getChannels)

const onchange = (listener) => db
    .changes()
    .run(r.cxn)
    .then(cursor => cursor.each(
        (err, x) => listener(x)
    ));

exports.change = (listener) => r.connected
    .then(() => onchange(listener));
    
