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

    var params = params || {};

    function my (req, res) {
        return my.render(req)
            .then(html => res.send(html))
            .catch(err => my.oops(req, res, err));
    } 

    my.oops = () => console.log('oops');

    my.pugc = pug.compileFile(path.join(dir, src + '.pug'))
    
    my.render = (req) => promises(req)
        .object(...params)
        .then(data => my.pugc(data));

    my.use = (param) => {
        params.push(param);
        return my;
    }

    my.catch = (handler) => {
        console.log('changing')
        my.oops = handler;
        return my;
    }

    my.dothen = f => {
        dothen = f;
        return my;
    }

    my.include = (key, view) => {
        param = {};
        params.push(req => view
            .render(req)
            .then(html => param[key] = html)
            .then(() => param)
        );
        /*
        my.catch((req, res, err) => {
            view.oops(req, res, err);
            my.oops(req, res, err);
        });
        */
        return my;
    }

    return my;
}

module.exports = view;
