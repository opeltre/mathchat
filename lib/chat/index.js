let chat = (function () {
 
    let thread = + window.location.pathname
            .replace(/^\/chat\/t\//, '');

    let usr = 'logged-out';

    let socket = io()
        .emit('subscribe', thread)
        .on('usr', u => chat.usr = u)
        .on('threads', fst.emit('threads'))
        .on('join', fst.emit('join'))
        .on('msg', fst.emit('msg'));

    let getThreads = 
        (ts, M) => ({ threads: ts });

    let getMsgs = 
        (ms, M) => ({ msgs: [...M.msgs, ...ms] });

    let putMsg = 
        (_, M) => {
            socket.emit('send', {
                to :    thread,
                body :  M.type
            });
            fst.emit('-> main', {type: ''})();
        };

    let printMsgs = 
        scroll => 
            () => MathJax.Hub.Queue(
                ['Typeset', MathJax.Hub, '#msgs'],
                scroll
                    ? [ fst.emit('scroll') ]
                    : [ () => {} ]
            );

    fst.$('main')
        .model({ 
            threads:    [],
            msgs:       [], 
            type:       '' 
        })
        .up('threads', getThreads)
        .up('join', __.id, printMsgs(true))
        .up('msg', getMsgs, printMsgs(false))

    fst.$('button#send')
            .on('click', putMsg);

    return { thread, socket, usr };

})();
