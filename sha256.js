#!/Users/sami/bin/node
// sha256.js
// (C) 2011 by Sami Tikka
// Calculate SHA256 checksums for files on the command line
// in the style of md5(1).

var crypto = require('crypto');
var fs = require('fs');

// Find the streams to read from command line parameters
var streams = [];
process.argv.slice(2).forEach(function(file, index, array) {
    streams.push({ 'file':file, 'stream':fs.createReadStream(file) });
});

// If no files, read stdin
if (streams.length == 0) {
    streams.push({ 'file':'stdin', 'stream':process.stdin });
    process.stdin.resume();
}

// Do it all in parallel
streams.forEach(function(val, index, array) {
    var file = val['file'];
    var stream = val['stream'];
    var h = crypto.createHash('sha256');
    stream.on('data', function(chunk) {
	h.update(chunk);
    });
    stream.on('end', function() {
	process.stdout.write('SHA256 (' + file + ") = " + h.digest('hex') + '\n');
    });
});
