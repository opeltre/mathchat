fst.$('cloud')
    .model({down: [], up: []})
    .up('up')
    .up('down')
    .branch([
        fst.$('down'),
        fst.$('up')
    ]);

fst.$('down')
    .branch([
        ['h2', ['cloud']],
        fst('#files').branch(M => M.down.map(viewFile))
    ]);

fst.$('up')
    .branch([
        ['h2', ['upload']],
        fst.$('form#up-form')
    ]);

fst.$('input#up-input.hide')
    .attr({type: 'file', name: 'doc', multiple: 'true'})
    .on('change', fst.emit('up', e => ({up: Array.from(e.files)})));

fst.$('up-form')
    .attr({
        action: '/cloud/upload',
        enctype:'multipart/form-data',
        method: 'post'
    })
    .branch([
        ['label.upload-btn',
            {for: 'up-input'},
            [fst('i.fa.fa-folder-open')]
        ],
        fst.$('up-input'),
        ['button.upload-btn',
            {type: 'submit'},
            [['i.fa.fa-cloud-upload-alt']]
        ],
        fst('#preview').branch( M => M.up.map(
            f => fst('div', [f.name])
        ))
    ]);

main();
function main () {

    fst.ajax().get('/cloud/ajax')
        .then(JSON.parse)
        .then(files => fst.emit('down')({down: files}));
}

function viewFile (f) {

    return fst('.flex-h', [
        ['span.grow', [
            ['a', 
                {href: `/cloud/download/${f.href}`, download: f.name},
                [
                    ['i.fa.fa-cloud-download-alt'],
                    f.name
                ]
            ]
        ]],
        ['span.usr', [f.usr]]
    ]);
}
