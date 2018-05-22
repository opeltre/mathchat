const express = require('express'),
    path = require('path'),
    auth = require('auth'),
    view = require('view');

const db = require('./db'),
    upload = require('./upload'),
    download = require('./download');

var cloud = {};

cloud.view = view('cloud',
    req => {user: req.user},
    req => db.get(req.params[0], req.user)
        .then(f => ({files: f || []}))
);

cloud.upload = upload;

cloud.download = download;

cloud.app = index => {
    var app = express.Router();

    app.route('/upload')
        .all(auth.check)
        .post(cloud.upload('doc', 'fs'));

    app.route('/view*')
        .get(index.include('win', cloud.view))

    app.route('/download*')
        .all(auth.check)
        .get(cloud.download('fs'));

    return app;
}

module.exports = cloud;
