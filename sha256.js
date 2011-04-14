#!/Users/sami/bin/node
// sha256.js
// (C) 2011 by Sami Tikka
// Calculate SHA256 checksums for files on the command line
// in the style of md5(1).

var crypto = require('crypto');
var fs = require('fs');

var files = process.argv.slice(2);

var algorithm = 'sha256';
var bufSize = 16*1024;

function startReading(fileName, fd, hash, buf) {
    //console.log('Starting to read ' + fileName);
    fs.read(fd, buf, 0, bufSize, null, 
	    function (err, bytesRead, buf) {
		if (err) {
		    console.log(err);
		    fs.close(fd);
		    if (files.length > 0) {
			startHashing(files.shift());
		    }
		} else {
		    if (bytesRead > 0) {
			//console.log('Got ' + bytesRead + ' bytes');
			hash.update(buf.slice(0, bytesRead));
			startReading(fileName, fd, hash, buf);
		    } else if (bytesRead == 0) {
			process.stdout.write(algorithm.toUpperCase() + 
					     ' (' + fileName + ") = " + 
					     hash.digest('hex') + '\n');
			fs.close(fd);
			if (files.length > 0) {
			    startHashing(files.shift());
			}
		    }
		}
	    });
}

function startHashing(fileName) {
    //console.log('Opening ' + fileName);
    fs.open(fileName, 'r', 0666, function(err, fd) {
	if (err) {
	    console.log(err);
	    if (files.length > 0) {
		startHashing(files.shift());
	    }
	} else {
	    startReading(fileName, fd, crypto.createHash(algorithm), new Buffer(bufSize));
	}
    });
}

// If no files, read stdin
if (files.length == 0) {
    process.stdin.resume();
    startHashing(process.stdin);
} else {
    files.splice(0, 10).forEach(function(f) {
	startHashing(f);
    });
}

