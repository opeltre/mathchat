let chat = (function () {
    
    let path = //       path : /chat/ajax/<room> 
        window.location.pathname
            .replace(/^\/chat\/t\//,'/chat/ajax/');
    let room = //       room : /chat/t/<room> 
        window.location.pathname
            .replace(/^\/chat\/t\//, '');
    
    function my () {
        
        fst.ajax().get(path)
            .then(JSON.parse)
            .then(fst.emit('msg'))
    }

    function onSend (t, M) {
        
        let data = {body : M.type};
        fst.ajax(data).post(path);
        fst.emit('send', {type: ''});
    }

    my.socket = io()
        .emit('subscribe', room)
        .on('msg', fst.emit('msg', m => [m]));

    fst.$('chat')
        .model({ 
            msgs: [], 
            type: '' 
        })
        .up('msg', (msgs, M) => ({ msgs: [...M.msgs, ...msgs] }))
        .up('send')
        .branch([
            ['h2', ['chat']],
            fst.$('msgs'),
            fst.$('write')
        ])
        .plant('#win');

    fst.$('msgs')
        .branch(M => M.msgs.map(viewMsg))

    fst.$('write')
        .branch([
            fst.textarea('chat', 'type').html(M => M.type),
            fst('button')
                .branch([
                    ['i.fa.fa-paper-plane'],
                    'send'
                ])
                .on('click', onSend)
        ]);

    function viewMsg (msg) {
        return fst('.msg' + (msg.usr == 'oli' ? '.right':'.left'), [
            ['.msg-head', [
                ['span.date', [''+msg.date]],
                ['span.poster', [''+msg.usr]]
            ]],
            ['.msg-body', [''+msg.body]]
        ]);
    }

    return my;

})();

chat();
