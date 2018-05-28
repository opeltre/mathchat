const io = require('socket.io')(),
    auth = require('auth'),
    db = require('./db');

io.use(auth.io);

io.on('connection', socket =>
    socket.send('heyeyo')
);

db.change(0,
    change => io.emit('msg',JSON.stringify(lastMsg(change)))
);

function lastMsg (change) {
    var msgs = change.new_val.msgs;
    return msgs[msgs.length - 1];
}

module.exports = server => io.listen(server);
