var Tarine = require('tarine');
var path = require('path');
var fs = require('fs');

var server = new Tarine({
	ip: '127.0.0.1',
	port: 80
});

var types = {
	'script': {
		'js': 'text/javascript'
	},
	'style': {
		'css': 'text/css'
	},
	'image': {
		'png': 'image/png',
		'jpg': 'image/jpg',
		'jpeg': 'image/jpeg'
	},
	'font': {
		'ttf': 'application/octet-stream'
	}
};

function typesHandler(type, resource, request, response) {
	var t = types[type];
	if (!t) { return; }

	for (key in t) {
		var extension = '.' + key;
		var mimeType = t[key];

		var p = path.join(process.cwd(), type, resource + extension);
		server.log('checking path "' + p + '"');

		if (fs.existsSync(p)) {
			response.writeHead(200, 'Content-Type: ' + mimeType);
			var s = fs.createReadStream(p);
			s.pipe(response);
			return true;
		}
	}
}

server.dispatcher = function(request, response) {
	var regex = /^\/([a-z]+)\/([\w\-\.]+(?:\/[\w\-\.]+)*)(?:\/)?$/;
	var input = unescape(request.urlParsed.path);
	var result = regex.exec(input);
	if (result) {
		var type = result[1];
		var resource = path.normalize(result[2]);
		// resource may not contain two or more sequential dots. 
		if (!/\.\./.test(resource)) {
			if (typesHandler(type, resource, request, response)) { return; } 
		}
	}

	if (/^\/?$/.test(input)) {
		input = '/home';
	};

	if (/^\/home\/?$/.test(input)) {
		response.writeHead(200, 'Content-Type: text/html');
		fs.createReadStream('home.html').pipe(response);
		return;
	}

	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.end('Resource not found');
};

server.start();
