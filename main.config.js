// pm2 ecosystem configuration

module.exports = {
    apps: [{
        name: 'mathchat',
        watch: ['./'],
        ignore_watch: ['./files/'],
        script: 'main.js'
    }]
};

