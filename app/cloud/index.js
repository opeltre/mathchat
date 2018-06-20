const express = require('express'),
    path = require('path'),
    auth = require('auth');

const db = require('./db'),
    upload = require('./upload'),
    download = require('./download');

var cloud = {};

cloud.upload = upload('doc', 'fs');

cloud.download = download('fs');

cloud.app = view => {
    var app = express.Router();

    app.route('/')
        .get((req, res) => res.redirect(req.baseUrl + '/view'))

    app.route('/view*')
        .get(view().script('cloud'))

    app.route('/upload')
        .all(auth.check)
        .post(cloud.upload);

    app.route('/download*')
//        .all(auth.check)
        .get(cloud.download);

    /** with vdom **/
    app.route('/ajax*')
        .get((req, res) => db
            .get(req.params[0], req.user)
            .then(files => res.json(files))
        );

    return app;
}

module.exports = cloud;
