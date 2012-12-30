var http  = require('http');
var url   = require('url');
 
var defaults = {
	'ip':		'127.0.0.1',
	'port': '80',
	'dispatcher': function() {}
};

var Server = function(options) {
	if (!options) { options = {}; }
	for (key in defaults) {
		this[key] = options[key] ? options[key] : defaults[key];
	}
};

var p = Server.prototype;
module.exports = Server;

p.log = function(message) {
	console.log(message);
};

p.start = function() {
	// Stop the server if it is already running
	if (this.http) { this.stop(); }
	this.log('Starting...');

	var self = this;
	this.http = http.createServer(function(request, response) {
		try {
			var u = url.parse(request.url);
			// convert the path to array. E.g. /a/b -> ['a', 'b']
			var directive = u.path.substr(1).split('/');

			self.log(request.connection.remoteAddress + ' requests ' + u.href);

			request.urlParsed = u;
			request.directive = directive;
			self.dispatcher(request, response);
		} catch (e) {
			self.log('Uncaught server application exception:\n', e);
			response.writeHead(500);
			response.end('Internal Server Error');
		}
	});

	this.http.listen(this.port, this.ip, function() {
		self.log('Server started, listening on ' + self.ip + ':' + self.port);
	});
};

p.stop = function() {
	// Stop the server if it is running
	if (!this.http) { return; }
	this.log('Stopping...');

	var self = this;
	this.http.close(function() {
		self.log('Server stopped');
	});

	this.http = undefined;
};
