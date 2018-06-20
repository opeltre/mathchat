const fs = require('fs'),
    path = require('path'),
    view = require('view');

console.log(__dirname);

const html = {};

['index', 'login']
    .forEach(
        key => html[key] = fs
            .readFileSync(path.join(__dirname, key + '.html'))
    );

const scripts = [
    'vdom',
    'ajax', 
    '/dist/io.js'
];

const style = [
    'main',
    'fonts',
    '/static/fa/fontawesome-all.min.css',
    'https://fontlibrary.org/face/retroscape',
    'https://fontlibrary.org/face/glacial-indifference'
];

module.exports = key => 
    view(html[key])
        .script(...scripts)
        .style(...style);
