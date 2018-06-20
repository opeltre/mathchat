const fs = require('fs');
const { JSDOM } = require('jsdom');

var ifRelative = (f) => 
    name => ( name[0] === '/' || /^https?:\/\//.test(name) )
        ? name 
        : f(name);

var defaultPaths = {
    style : ifRelative(name => '/style/'+ name + '.css'), 
    script : ifRelative(name => '/lib/' + name + '.js')
};

//  view :: html -> ((req, res) -> {...})

function view (html, paths) {
    
    var paths = paths || defaultPaths,
        scripts = [],
        sheets = [];

    var dom = new JSDOM(html || ''),
        doc = dom.window.document;
    
    function my (req, res) {
        res.send(dom.serialize());
    }

    my.style = (...sheets) => {
        sheets.forEach(s => {
            var sheet = doc.createElement('link');
            sheet.rel = "stylesheet";
            sheet.href = paths.style(s);
            doc.head.appendChild(sheet);
        });
        return my;
    }

    my.script = (...srcs) => {
        srcs.forEach( s => {
            var node = doc.head;
                script = doc.createElement('script');
            script.src = paths.script(s);
            node.appendChild(script);
        });
        return my;
    }

    my.dom = (arg) => {
        if (!arg) 
            return dom;
        dom = arg;
        doc = dom.window.document;
        return my;
    }

    my.clone = () => 
        view(dom.serialize(), paths);

    return my;
}

module.exports = view;
