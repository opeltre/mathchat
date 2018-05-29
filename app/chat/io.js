const io = require('socket.io')(),
    auth = require('auth'),
    db = require('./db');

const connect = socket => socket
    .on('subscribe', id => socket.join(id));

const send = change => io
    .to(change.new_val.id)
    .emit('msg', change.new_val.msgs.pop());

db.change(send);
io.use(auth.io);
io.on('connection', connect);

module.exports = server => io.listen(server);
