// rdb/files.js

const r = require('./r'),
    db = r.db.table('files');

exports.put = (file, user) => db
    .insert({
        usr: user.usr,
        name: file.originalname,
        mime: file.mimetype
    })
    .run(r.cxn)
    .then(res => res.generated_keys[0])
    .catch(console.log);

exports.loaded = (file, user) => db
    .get(file.filename)
    .update({
        href: `${user.usr}/${file.filename}`,
        size: file.size
    })
    .run(r.cxn)
    .catch(console.log);

exports.get = (path, user) => db
    //.filter(x => x('usr').eq(user.usr))
    .run(r.cxn)
    .then(c => c.toArray())
    .catch(console.log);

exports.getOne = (path) => db
    .get(path)
    .run(r.cxn);
