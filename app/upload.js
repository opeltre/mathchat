/* ./upload.js

upload with multer
    : app.post('/upload', upload(<fieldname>), ...);
*/

const multer = require('multer'),
    path = require('path'),
    db = require('../rdb/files.js');

var storage = multer.diskStorage({
    destination: (req, file, done) => {
        done(null, path.join(__dirname, '../files/'+ req.user.usr));
    },
    filename: (req, file, done) => {
        console.log('put file:');
        console.log(file);
        db.put(file, req.user)
            .then(id => done(null, id))
            .catch(err => done(err, false));
    }
});

module.exports = name => [
    multer({storage: storage}).single(name),
    (req, res, next) => db
        .loaded(req.file, req.user)
        .then(() => next()),
    (req, res) => res.json(req.file),
];
