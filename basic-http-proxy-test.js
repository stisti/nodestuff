#!/usr/bin/env node

var http = require('http');
var proxy = http.createServer(function (req, resp) {
    //console.log('Proxy got request for: ' + req.url);
    //console.log(JSON.stringify(req.headers) + '\n');
    var options = {
        port: 14285,
        path: req.url,
        method: req.method,
        headers: req.headers,
    };
    var subreq = http.request(options, function(subresp) {
        //console.log('Proxy got response from backend:');
        //console.log(JSON.stringify(subresp.headers) + '\n');
        resp.writeHead(subresp.statusCode, subresp.headers);
        subresp.pipe(resp);
    });
    subreq.on('error', function (e) {
        console.log('Proxy got error with subrequest: ' + e.message);
    });
    req.pipe(subreq);
});
proxy.listen(6001, "127.0.0.1", function () {
    console.log('Started listening to port 6001');
});
