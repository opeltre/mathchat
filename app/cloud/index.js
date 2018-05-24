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

cloud.upload = upload('doc', 'fs');

cloud.download = download('fs');

cloud.app = index => {
    var app = express.Router();

    app.route('/')
        .get((req, res) => res.redirect(req.baseUrl + '/view'))

    app.route('/view*')
        .get(index().include('win', cloud.view))

    app.route('/upload')
        .all(auth.check)
        .post(cloud.upload);

    app.route('/download*')
//        .all(auth.check)
        .get(cloud.download);

    return app;
}

module.exports = cloud;
