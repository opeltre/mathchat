let chat = (function () {
 
    let thread = + window.location.pathname
            .replace(/^\/chat\/t\//, '');

    let path = '/chat/ajax/' + thread;
    
    let socket = io()
        .emit('subscribe', thread)
        .on('msg', fst.emit('msg'));

    let mathjax = 
        () =>  MathJax.Hub.Queue(
            ['Typeset', MathJax.Hub, '#msgs']
        );

    function putMsg (_, M) {
        
        let msg = {
            to :    thread,
            body :  M.type
        };
        socket.emit('send', msg);
        fst.emit('-> chat', {type: ''})();
    }

    fst.$('chat')
        .model({ 
            msgs: [], 
            type: '' 
        })
        .up(
            'msg', 
            (msgs, M) => ({ msgs: [...M.msgs, ...msgs] }), 
            mathjax
        )
        .branch([
            ['h2', ['chat']],
            center(
                fst.$('msgs'),
                fst.$('write')
            )
        ])
        .plant('#win');

    fst.$('msgs')
        .branch(M => M.msgs.map(viewMsg))

    fst.$('write')
        .branch([
            fst.textarea('chat', 'type').html(M => M.type),
            ['div', [
                fst('button')
                    .branch([
                        ['i.fa.fa-paper-plane'],
                        'send'
                    ])
                    .on('click', putMsg)
            ]]
        ]);

    function viewMsg (msg) {
        let side = msg.from == 'oli' ? '.right' : '.left';
        return fst('.msg' + side, [
            ['.msg-head', [
                ['span.date', [''+msg.date]],
                ['span.poster', [''+msg.from]]
            ]],
            ['.msg-body' + side, [''+msg.body]]
        ]);
    }

    function center (...divs) {
        return ['.flex-h', [
            ['.grow'],
            ['.center', divs],
            ['.grow']
        ]];
    }

})();

