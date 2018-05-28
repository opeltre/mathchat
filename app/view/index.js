/* app/view.js

just send the html!
    : app.route('/')
    :   .get(view.html('index'));

exports.html = (name) => 
    (req, res) => res.sendFile(path.join(dir, name + '.html'));
*/

const path = require('path'),
    pug = require('pug'),
    runtime = require('./runtime'),
    promises = require('./promises');

const dir = path.join(__dirname, 'pug');

function view (src, ...params) {

    var params = params;

    function my (req, res) {
        my.render(req)
            .then(html => res.send(html))
            .catch(console.log);
    } 

    my.pugc = pug.compileFile(path.join(dir, src + '.pug'))
    
    my.render = (req) => promises(req)
        .object(...params)
        .then(data => my.pugc(data));

    my.use = (param) => {
        params.push(param);
        return my;
    }

    my.include = (key, view) => {
        param = {};
        params.push(req => view
            .render(req)
            .then(html => param[key] = html)
            .then(() => param)
        );
        return my;
    }

    return my;
}

module.exports = view;
