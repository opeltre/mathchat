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
    .then(d => d.msgs)

const getChannels = (user) => db
    .getAll(user, {index: 'users'})
    .run(r.cxn)
    .then(c => c.toArray())

exports.getChannels = (user) => Promise
    .all([user, 'public'].map(getChannels))
    .then(([channels, pubchannels]) => ({channels, pubchannels}));

exports.putChannel = (users, name) => db
    .insert({
        users,
        name,
        msgs: []
    });

const onchange = (listener) => db
    .changes()
    .run(r.cxn)
    .then(cursor => cursor.each(
        (err, x) => listener(x)
    ));

exports.change = (listener) => r.connected
    .then(() => onchange(listener));
    
