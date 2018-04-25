// pm2 ecosystem configuration

module.exports = {
    apps: [{
        name: 'mathchat',
        watch: ['./', '../rdb', '../lib', '../views'],
        script: './index.js'
    }]
};

