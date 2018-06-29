logthen = x => {console.log(x); return x};

var cloud = (function () {

    function my () {
        ajax().get('/cloud/ajax')
            .then(JSON.parse)
            .then(my.app)
            .then(app => app());    
    }

    my.app = files => dom.app('cloud')
        .model({download: files, upload:[]})
        .view(my.view)
        .on('newFile', (model, msg) => Object.assign(model, msg));

    my.fileMsg = dom.emit(
        'newFile#cloud', 
        input => ({upload: Array.from(input.files)})
    ); 

    /*** view ***/

    my.view = model => 
        dom('div#cloud', [
            ['#download', [
                ['h2', ['cloud']],
                ['#files', model.download.map(my.viewFile)]
            ]],
            ['#upload', [
                ['h2', ['upload']],
                my.viewUpload(model)
            ]]
        ])
        .plant('#win');

    my.viewFile = f => 
        dom('.flex-h', [
            ['span.grow', [
                ['a', 
                    {
                        href: `/cloud/download/${f.href}`,
                        download: f.name
                    }, 
                    [ 
                        ['i.fa.fa-cloud-download-alt'],
                        f.name
                    ]
                ]
            ]],
            ['span.usr', [f.usr]]
        ]);
    
    my.inputFile = 
        dom(
            'input#browse.hide',
            {type: 'file', name:'doc', multiple:'true'}
        )
        .on('change', e => my.fileMsg(e));

    my.viewUpload = model => 
        dom('form',
            {
                action: '/cloud/upload',
                enctype:'multipart/form-data',
                method: 'post'
            },
            [
                ['label.upload-btn',
                    {for: 'browse'},
                    [dom('i.fa.fa-folder-open')]
                ],
                my.inputFile,
                ['button.upload-btn',
                    {type: 'submit'},
                    ['i.fa.fa-cloud-upload-alt']
                ],
                ['#preview', model.upload
                    .map(f => dom('div',[f.name]))
                ]
            ]
        );
        
    return my;

})();

cloud();
