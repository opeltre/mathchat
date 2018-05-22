/* ./upload.js

upload with multer
    : app.post('/upload', upload(<fieldname>), ...);
*/

const multer = require('multer'),
    path = require('path'),
    db = require('./db');

var dest = 'fs'

var storage = dest => 
    multer.diskStorage({
    
        destination: (req, file, done) => {
            done(null, path.join(__dirname, dest || 'fs', req.user.usr));
        },
        
        /* 1: db.put */
        filename: (req, file, done) => db
            .put(file, req.user)
            .then(id => done(null, id))
            .catch(err => done(err, false))

    });

module.exports = (fieldname, dest) => [
    
    multer({storage: storage(dest)}).single(fieldname),
    
    /* 2: db.loaded */
    (req, res, next) => db
        .loaded(req.file, req.user)
        .then(() => next()),
    
    (req, res, next) => db
        .getOne(req.file.filename)
        .then(f => res.json(f))

];
