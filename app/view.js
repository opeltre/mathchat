/* app/view.js

just send the html!
    : app.route('/')
    :   .get(view.html('index'));

pug it...
    : app.route('/files')
    :   .get(view.pug('cloud', req => dataPromise(req)));
*/

const path = require('path'),
    pug = require('pug');

const dir = path.join(__dirname, '../views');

exports.html = (name) => 
    (req, res) => res.sendFile(path.join(dir, name + '.html'));

exports.pug = (name, promise) =>
    (req, res) => Promise.resolve()
        .then(() => promise(req))
        .then(data => res.send(pug.renderFile(
            path.join(dir, name + '.pug'),
            data
        )))
        .catch(console.log);
