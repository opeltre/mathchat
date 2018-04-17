/* ./upload.js

upload middleware => formidable
    : app.post('/upload', upload("tmp/"), ...);
*/

const formidable = require('formidable');

module.exports = (dest) => {
    return (req, res) => {
        var form = new formidable.IncomingForm();
        form.uploadDir = dest;
        form.parse(req, (err,fields,files) => {
            res.end(JSON.stringify({
                fields: fields,
                files: files
            }, null, 1));
        });
    }
};
