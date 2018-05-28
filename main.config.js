// pm2 ecosystem configuration

module.exports = {
    apps: [{
        name: 'mathchat',
        watch: ['./'],
        ignore_watch: [
            './app/cloud/fs/', 
            './app/view/run/'
            '.git/'
        ],
        script: 'main.js'
    }]
};

