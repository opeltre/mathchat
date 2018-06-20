var logthen = x => {console.log(x); return x}

var chat = (function () {
    
    var path = //       path : /chat/ajax/<room> 
        window.location.pathname
            .replace(/^\/chat\/t\//,'/chat/ajax/');
    var room = //       room : /chat/t/<room> 
        window.location.pathname
            .replace(/^\/chat\/t\//, '');

    var msgs = [];
    
    function my () {
        ajax().get(path)
            .then(JSON.parse)
            .then(my.app)
            .then(app => app());
    }

    my.app = (msgs) => dom.app('chat')
        .model(msgs)
        .view(my.view)
        .on('read', (M, msg) => M.concat([msg]))
        .on('send', (M) => my.send(M));

    my.sendMsg = dom.emit('send#chat');

    my.send = (Model) => {
        var text = document.querySelector('#type').value
        console.log(path);
        ajax()
            .post(path, {body: text})
        return Model;
    };

    my.socket = io()
        .emit('subscribe', room)
        .on('msg', msg => dom.emit('read#chat', msg)());

    /*** view ***/
    my.view = model => 
        dom('#chat', [
            dom('h2', ['chat']),
            dom('#msgs', model.map(my.viewMsg)),
            dom('#write', my.viewWrite())
        ])
        .plant('#win')
        .show('chat:');

    my.viewMsg = msg => 
        dom('.msg'+(msg.usr == 'oli' ? '.right':'.left'), [
            dom('.msg-head', [
                dom('span.date', [msg.date]),
                dom('span.poster', [msg.usr])
            ]),
            dom('.msg-body', [msg.body])
        ]);

    my.viewMsg2 = msg =>
        // with element constructor list syntax
        dom('.msg'+(msg.usr == 'oli' ? '.right':'.left'), [
            ['.msg-head', [
                ['span.date', [msg.date]],
                ['span.poster', [msg.usr]]
            ]],
            ['.msg-body', [msg.body]]
        ]);

    my.viewWrite = () => [
        dom('textarea#type'),
        dom(
            'button',
            [
                dom('i.fa.fa-paper-plane'),
                'send'
            ]
        )
        .on('click', e => my.sendMsg(e))
    ];

    return my;

})();

chat();
