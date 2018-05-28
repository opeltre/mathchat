const pug = require('pug'),
    path = require('path'),
    fs = require('fs');

var dir = __dirname;

fs
    .readdirSync(path.join(__dirname, 'pug')) 
    .map(name => /^(.*)\.run\.pug$/.exec(name))
    .filter(match => match != null)
    .map(x => ({
        filename:   x[0],
        name:       x[1],
        path:       path.join(dir, 'pug', x[0])
    }))
    .map(x => ({
        path: path.join(dir, 'run', x.name + '.js'),
        src: pug.compileFileClient(x.path, {name: x.name})
    }))
    .forEach(x => fs.writeFileSync(x.path, x.src));
