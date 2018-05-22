const path = require('path');

module.exports = dest => 
    (req, res, next) => {
        var src = path.join(__dirname, dest, req.params[0]);
        res.sendFile(src);
        next;
    };

