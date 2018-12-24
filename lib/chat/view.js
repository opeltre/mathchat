(function () {    
   
    fst.$('msgs')
        .branch(M => M.msgs.map(viewMsg))

    fst.$('threads')
        .branch(M => M.threads.map(viewThread));

    fst.$('main')
        .attr({class: 'flex-h'})
        .branch([
            ['.flex-v', [
                ['h3', ['threads']],
                fst.$('threads')
            ]],
            ['.grow.flex-v', [
                ['h3.name', [ M => M.name ]],
                fst.$('chat')
            ]]
        ])
        .plant('#win')

    fst.$('chat')
        .attr({class: 'scroll-y max-y'})
        .branch([
            fst.$('msgs'),
            fst.$('type')
        ])
        .up('scroll', false, f => scrollChat(f));

    fst.$('type')
        .branch([
            fst.textarea('chat', 'type').html(M => M.type),
            ['div', [ 
                fst.$('send').branch([
                    ['i.fa.fa-paper-plane'],
                    'send'
                ])
            ]]
        ]);


    let viewThread = 
        t => ['.thread.flex-h', [
            ['.thread-name', [ t.name ] ],
            ['.grow'],
            ['.thread-users',  
                t.users.map(u => ['span', [ u ]])
            ]
        ]];
    
    let viewMsg = 
        msg => fst('.msg' + align(msg), [
            ['.msg-head', [
                ['span.date', [''+msg.date]],
                ['span.poster', [''+msg.from]]
            ]],
            ['.msg-body.ft0.left', [''+msg.body]]
        ]);

    let align = msg => msg.from === chat.usr ? '.right' : '.left';

    let scrollChat = 
        f => {
            f.node().scrollTop = f.node().scrollHeight;
        };

})();
