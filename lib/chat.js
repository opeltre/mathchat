var chat = (function () {

    var path = "/ajax" + window.location.pathname;

    function my (path) {
        ajax().get(path)
            .then(JSON.parse)
            .then(my.app);
    }

    my.app = msgs => 
        live('msg', {
            model : {msgs, text:''}
            view : my.view,
            update : my.update
        });
   
    my.update = (msg, model) => ({
        msgs : model.push(msg),
        text : ''
    });

    my.socket = io()
        .emit('subscribe', my.room)
        .on('msg', m => dom.emit('msg', msg);

    my.send = (text) => ajax()
        .post(my.path, {body:text});

    /*** VIEW ***/
    my.view =  model => 
        dom('#chat', [
            dom('h2', ['chat']),
            dom('#msgs', model.msgs.map(my.viewMsg)),
            dom('#write', my.viewWrite(text))
        ]);

    my.viewMsg = msg => 
        dom('.msg.'+(msg.usr == 'oli' ? 'right':'left'), [
            dom('.msg-head', [
                dom('span.date', [m.date]),
                dom('span.poster', [m.usr])
            ]),
            dom('.msg-body', [m.body])
        ]);

    my.viewWrite = text => [
        dom('textarea', [text]),
        dom('button#send')
            .on('click', my.send(text))
            .branch(
                dom('i.fa.fa-paper-plane'),
                'send'
            )
    ];

}
