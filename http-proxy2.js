#!/usr/bin/env node

var httpProxy = require('http-proxy');

var options = {
    router: {
        'localhost/jenkins':   '127.0.0.1:14285',
        'sarah.local/jenkins': '127.0.0.1:14285',
        'sti.iki.fi/jenkins':  '127.0.0.1:14285'
    }
};

httpProxy.createServer(options).listen(80, "0.0.0.0", function () {
    process.setuid('nobody');
});
