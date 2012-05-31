#!/usr/bin/env node
/*
 * httpget.js - A simple command-line http client.
 *
 * GETs the URL on the command line and writes it to stdout, server headers to stderr.
 * Multiple URLs will be output concatenated.
 */
var program = require('commander');
program
    .version('0.0.1')
    .option('-r, --reload', 'reload the URL when talking to a caching proxy')
    .parse(process.argv);

var http = require('http');
var url = require('url');

function http_get(urls) {
    if (!urls) {
        return;
    }
    var firstUrl = urls.shift();
    if (!firstUrl) {
        return;
    }
    var parse = url.parse(firstUrl);
    var options = {
            method: 'GET',
            host:   parse.host,
            port:   parse.port ? parse.port : 80,
            path:   parse.path,
    };
    if (program.reload) {
        options["cache-control"] = "no-cache";
    }
    var req = http.request(
        options, 
        function (res) {
            process.stderr.write(res.statusCode + '\n');
            for (var h in res.headers) {
                process.stderr.write(h + ': ' + res.headers[h] + '\n');
            }
            res.pipe(process.stdout, { end: false });
            res.on('end', function () {
                http_get(urls);
            });
            res.on('error', function (e) {
                console.error(e.message);
                http_get(urls);
            });
        });
    req.on('error', function (e) {
        console.error(e.message);
        http_get(urls);
    });
    req.end();
};

http_get(program.args);
