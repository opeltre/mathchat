/* ./upload.js

upload with multer
    : app.post('/upload', upload(<fieldname>), ...);
*/

const multer = require('multer');
const db = require('../rdb/files.js');

var storage = multer.diskStorage({
    destination: (req, file, done) => {
        done(null, 'tmp/'+ req.user.usr);
    },
    filename: (req, file, done) => {
        db.put(req.user, file)
            .then(id => done(null, id))
            .catch(err => done(err, false));
    }
});

module.exports = name => multer({storage: storage}).single(name);
