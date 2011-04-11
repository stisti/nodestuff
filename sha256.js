#!/Users/sami/bin/node
// sha256.js
// (C) 2011 by Sami Tikka
// Calculate SHA256 checksums for files on the command line
// in the style of md5(1).

var crypto = require('crypto');
var fs = require('fs');

var files = process.argv.slice(2);

function startHashing(stream) {
    var h = crypto.createHash('sha256');
    stream.on('data', function(chunk) {
	h.update(chunk);
    });
    stream.on('end', function() {
	process.stdout.write('SHA256 (' + stream.path + ") = " + h.digest('hex') + '\n');
	if (files.length > 0) {
	    startHashing(fs.createReadStream(files.shift()));
	}
    });
}

// If no files, read stdin
if (files.length == 0) {
    process.stdin.resume();
    startHashing(process.stdin);
} else {
    files.splice(0, 100).forEach(function(f) {
	startHashing(fs.createReadStream(f));
    });
}

