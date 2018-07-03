const fs = require('fs'),
    path = require('path'),
    view = require('view');

const html = {};
['index', 'login']
    .forEach(key => 
        html[key] = fs
            .readFileSync(path.join(__dirname, key + '.html'))
    );

const scripts = [
    'vv',
    'ajax', 
    '/dist/io.js',
    'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js',
 //   '?config=TeX-AMS_SVG',
    'mathjax',
    'dom-to-image',
    'parser',
    'bmp2svg',
];

const style = [
    'main',
    'fonts',
    '/media/fa/fontawesome-all.min.css',
];

module.exports = key => 
    view(html[key])
        .script(...scripts)
        .style(...style);
