(function view () {    

    fst.$('chat')
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
                fst.$('send').branch([
                    ['i.fa.fa-paper-plane'],
                    'send'
                ])
            ]]
        ]);

    function viewMsg (msg) {

        let side = msg.from === chat.usr ? '.right' : '.left';

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
