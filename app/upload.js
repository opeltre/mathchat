/* ./upload.js

upload middleware => formidable
    : app.post('/upload', upload("tmp/"), ...);
*/

const multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, done) => {
        done(null, 'tmp/');
    },
    filename: (req, file, done) => {
        done(null, req.user.usr + Date.now());
    }
});

module.exports = name => multer({storage: storage}).single(name);
