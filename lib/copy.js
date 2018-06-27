var copist = (function () {
    
    function my () {
        my.app = my.app();
        my.app();
    }; 

    my.app = () => dom.app('copist')
        .model({
            from: 'olivier@peltre.xyz',
            to: 'opeltre@gmail.com',
            subject: 'noEmit',
            raw: '', 
            parsed: ''
        })
        .view(my.view)
        .on('preview', my.preview)
        .on('send', my.send);

    my.preview = 
        (M, msg) => {
            setTimeout(
                () => MathJax.Hub.Queue(["Typeset",MathJax.Hub,"copist-out"]),
                200 
            )
            return Object.assign(M, {
                raw: msg, 
                parsed: parser(msg)
            });
        }

        
    my.send = 
        () => domtoimage
            .toPng(dom.$('#copist-out'))
            .then(data => my.showImg(data));

    my.showImg = 
        data => {
            var img = new Image ();
            img.src = data;
            img.style['max-width'] = "100%";
            img.style['max-height'] = "100%";
            dom.$('#copist-out').appendChild(img);
        }

        /*
        () => ajax()
            .post('/copy/mailer', 
                Object.assign(my.app.model(),
                    {parsed: dom.$('#copist-out').innerHTML}
                )
            )
            .then(alert);
*/

    my.previewMsg = 
        dom.emit('preview#copist',
            () => dom.$('textarea').value
        );

    my.copy = 
        (e) => {
            console.log('trying to copy');
            var html = dom.$('#copist-out').innerHTML;
            e.clipboardData.setData('text/plain', html);
            e.preventDefault();
        };

    my.askCopy = 
        (e) => {
            console.log('please copy');
            document.execCommand('copy');
        };

    my.view = 
        M => 
            dom('#copy.grow.flex-h.stretch', [
                ['.grow.flex-v.stretch', [
                    dom('textarea#copist-in.grow').value(M.raw),
                    dom('button')
                        .html('preview')
                        .on('click', my.previewMsg)
                ]],
                ['.grow.flex-v.stretch', [
                    dom('#copist-out.grow').html(M.parsed),
                    dom('button#copy')
                        .html('send')
                        .on('click', my.send)
                ]]
            ])
            .plant('#win');

    return my;

})();

document.addEventListener('DOMContentLoaded', () => copist());


