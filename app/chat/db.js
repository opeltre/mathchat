const r = require('../rdb.js'),
    db = r.db;

/***
exports

    .putThread  :: t -> usr -> Put thread
    .getThread  :: id -> Get thread
    .getByUser  :: usr -> Get [thread]

    .putMsg     :: m -> usr -> Put msg
    .onMsg      :: (msg -> a) -> On msg 

   msg:
----------------------------------------
[id]    (to)    from    body    date   
----------------------------------------
hash    url     usr     str     int    
----------------------------------------
         |
         `---------.
                   |        
    thread:        V
----------------------------------------------------
[id]   (users)   *msgs*    name    admin     date     last
----------------------------------------------------
url    [usr]     [msg]     str     [usr]     int      msg
----------------------------------------------------

***/

//  Thread : t -> usr -> thread
let Thread = (t, usr) => 
    Object.assign(t, {
        admin:  [usr],
        date:   Date.now()
    });

//  .putThread : t -> usr -> Put thread
exports.putThread = 
    (t, usr) => db.table('threads')
        .insert(Thread(t, usr))
        .run(r.cxn);

let getMsgs = 
    thread => db.table('msgs')
        .getAll(thread, {index: 'to'})
        .orderBy(r.asc('date'))
        .coerceTo('array');

//  .getThread : id -> Get thread
exports.getThread = 
    id => db.table('threads')
        .get(id)
        .merge({msgs: getMsgs(id)})
        .run(r.cxn);

//  .getByUser : usr -> Get [thread]
exports.getByUser = 
    usr => db.table('threads')
        .getAll(usr, {index: 'users'})
        .coerceTo('array')
        .run(r.cxn);

//  Msg :  m -> usr -> msg
let Msg = (m, usr) => 
    Object.assign(m, {
        from:   usr,
        date:   Date.now()
    });

let hasUser =
    (id, usr) => db.table('threads').get(id)('users').contains(usr);

let putMsg =
    msg => r
        .branch(
            hasUser(msg.to, msg.from),
            db.table('msgs').insert(msg),
            r.error('unallowed user')
        )
        .run(r.cxn);

//  .putMsg : m -> usr -> Put msg
exports.putMsg = 
    (m, usr) => putMsg(Msg(m, usr));

let onMsg = 
    listener => db.table('msgs')
        .changes()
        .run(r.cxn)
        .then(csr => csr.each(
            (err, x) => listener(x.new_val)
        ));

//  .onMsg : (msg -> a) -> On msg
exports.onMsg = 
    listener => r.connected
        .then(() => onMsg(listener));
