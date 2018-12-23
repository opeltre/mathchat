let chat = (function () {
 
    let thread = + window.location.pathname
            .replace(/^\/chat\/t\//, '');

    let usr = 'logged-out';

    let socket = io()
        .emit('subscribe', thread)
        .on('usr', u => chat.usr = u)
        .on('msg', fst.emit('msg'))
        .on('threads', fst.emit('threads'))

    
    let putMsg = 
        (_, M) => {
            socket.emit('send', {
                to :    thread,
                body :  M.type
            });
            fst.emit('-> chat', {type: ''})();
        };

    let mathjax = 
        () => MathJax.Hub.Queue(
            ['Typeset', MathJax.Hub, '#msgs']
        );

    fst.$('button#send')
            .on('click', putMsg);

    fst.$('chat')
        .model({ 
            msgs: [], 
            type: '' 
        })
        .up(
            'msg', 
            (msgs, M) => ({ msgs: [...M.msgs, ...msgs] }), 
            mathjax
        );

    fst.$('threads')
        .model({
            threads : []
        })
        .up('threads', threads => ({threads}));

    return { thread, socket, usr };

})();
