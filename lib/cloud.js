var cloud = (function () {

    function my (files) {
        live('file', {
            model : files,
            view : my.view,
            update : (msg, model) => msg.files
        });
    }

    my.view = files => dom('#cloud', [
            dom('#download', [
                dom('h2', ['cloud']),
                dom('#files', 
                    files.map(my.viewFile)
                )
            ]),
            dom('#upload', [
                dom('h2', ['upload']),
                my.viewUpload
            ])
        ).plant('#win');
    }

    my.viewFile = f => dom('.flex-h', [
        dom('span.grow', [
            dom('a', 
                {
                    href: `/cloud/download/${f.href}`,
                    download: f.name
                }, 
                [ 
                    dom('i.fa.fa-cloud-download-alt'),
                    f.name
                ]
            )
        ]),
        dom('span.usr', ['f.usr'])
    ]);
    
    my.inputFile = 
        dom(
            'input#browse.hide',
            {type: 'file', name:'doc', multiple:'true'}
        )
        .on('change', my.fileInput);

    my.viewUpload = dom('form',
        {
            action: '/cloud/upload',
            enctype:'multipart/form-data',
            method: 'post'
        },
        [
            dom('label.upload-btn',
                {for: 'browse'},
                [dom('i.fa.fa-folder-open')]
            ),
            my.inputFile,
            dom('button.upload-btn',
                {type: 'submit'},
                [dom('i.fa.fa-cloud-upload-alt')]
            )
        ]
    );
        
    return my;

});
