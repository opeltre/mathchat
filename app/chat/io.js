let io = require('socket.io')(),
    auth = require('auth'),
    __ = require('@opeltre/forest').__,
    db = require('./db');

let connect = 

    socket => {

        let usr = socket.request.user.usr;

        let handshake = 
            () => socket.emit('usr', usr);

        let getByUser = 
            () => db.getByUser(usr)
                .then(ts => socket.emit('threads', ts));

        let getThread = 
            id => db.getThread(+id)
                .then(t => socket.emit('msg', t.msgs));

        let joinThread = 
            id => socket.join(id);

        let putMsg = 
            m => db.putMsg(m, usr); 

        __.do(handshake, getByUser)()
        socket.on('subscribe', __.do(getThread, joinThread));
        socket.on('send', putMsg);

    };


let emit = 

    msg => io
        .to(msg.to)
        .emit('msg', [msg]);


module.exports = 

    server => {

        io.use(auth.io);
        io.on('connection', connect);
        db.onMsg(emit);
        io.listen(server);

    };
