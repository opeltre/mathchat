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
    '/dist/io.js',
    'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js' +
    '?config=TeX-MML-AM_CHTML',
    'parser'
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
