const path = require('path');

module.exports = dest => 
    (req, res, next) => {
        res.sendFile(path.join(__dirname, dest, req.params[0]));
        next;
    }

