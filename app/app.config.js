// pm2 ecosystem configuration

module.exports = {
    apps: [{
        name: 'mathchat',
        watch: ['app/', 'rdb/', 'surfer/'],
        ignore_watch: ['app/tmp/'],
        script: './index.js'
    }]
};

