#!/usr/bin/env node
//
// split.js
// (C) 2011 Sami Tikka
// 
// split.js file1 [file2...]
// 
// Read stdin and split it into files given on command line.
// First line of stdin goes to file1, second to file2 and so on.

var fs = require('fs');
var DELIMITER = '\n';
var files = process.argv.slice(2);

var outStreams = [];
files.forEach(function(f) {
    outStreams.push(fs.createWriteStream(f));
});

var currentOutStream = 0;

process.stdin.setEncoding('utf8');
process.stdin.resume();
process.stdin.on('data', function (chunk) {
    var paths = chunk.split(DELIMITER);
    var last = paths.pop();
    paths.forEach(function (path) {
        outStreams[currentOutStream].write(path + DELIMITER);
        currentOutStream = (currentOutStream + 1) % outStreams.length;
    });
    if (last.length > 0) {
        // last entry did not have DELIMITER at end, so handle it specially
        outStreams[currentOutStream].write(last);
        // not incrementing currentOutStream because next chunk will continue this
    }
});

process.stdin.on('end', function() {
    outStreams.forEach(function(s) {
        s.end();
    });
});