var Tarine = require('tarine');

var server = new Tarine({
	port: 80
});

server.dispatcher = function(request, handler) {
	console.log('dispatched');
};

server.start();
