
var fs = require('fs');
var path = require('path');
var http = require('http');
var url = require('url');
var sys = require('sys');

var makeDirectoryPath = function(p) {
  if(p !== '/' && p.charAt(p.length - 1) !== '/') {
    return p + '/';
  }
  return p;
};

var Site = function(directory) {

  directory = makeDirectoryPath(directory);

  // Check if the provided path is indeed a directory
	try {
		stats = fs.statSync(directory);
	} catch (e) {
		e.message = 'Website directory was not found or could not be opened\n' + e.message;
		throw e;
	}

  if (!stats.isDirectory()) {
    throw new Error('Website path must be a directory');
  }

  this.directory = directory;

  // Check if the provided website directory contains a 'server.json' file and
  // parse it. 
  try {
    var json = fs.readFileSync(path.resolve(directory, 'server.json'), 'utf8');
    var properties = JSON.parse(json);
  } catch (e) {
    e.message = 'Website properties could not be found, read or parsed\n' + e.message;
    throw e;
  }

  this.properties = properties;
}

Site.prototype.start = function() {

  var site = this;

  if(site.server !== undefined) {
    throw new Error('Server already started');
  }

  site.server = http.createServer(function(request, response) {
    try {
      //pipe some details to the node console
      console.log('Incoming Request from: ' + request.connection.remoteAddress + ' for href: ' + url.parse(request.url).href);
   
      //dispatch our request
      site.dispatch(request, response);
   
    } catch (err) {
      //handle errors gracefully
      sys.puts(err);
      response.writeHead(500);
      response.end('Internal Server Error');
    } 
  });

  site.server.listen(site.properties.port, site.properties.host, function() {
    console.log('Server running at http://'+site.properties.host+':'+site.properties.port+'/');
  }); 
  
}

Site.prototype.stop = function() {

  var site = this;

  if(site.server === undefined) {
    throw new Error('Trying to stop server that wasn\'t running');
  }

  site.server.close(function() {
    console.log('Stopped server at http://'+site.properties.host+':'+site.properties.port+'/');
    delete site.server;
  });

}

Site.prototype.dispatch = function(request, response) {
  
  var site = this;

  var u = url.parse(request.url);
  var d = path.resolve(path.normalize(unescape(u.pathname)));

  var dir = site.directory + 'controller/';
  var args = d.substr(1).split('/');

  var content = 'Requested "' + d + '"\n\n';

  var controller_path, controller_i;

  // find a controller in the website
  var i = 0;
  while(true) {
    var p = dir + 'controller.js';
    content += 'Looking for controller "' + p + "\" (" + args.slice(i).join(', ') + ")...\n";

    // check if controller exists
    if(!fs.existsSync(p)) {
      content += 'Did not find controller "' + p + '"\n';
      break;
    }

    controller_path = p;
    controller_i = i;

    if (i === args.length) {
      break;
    }

    dir += args[i++] + '/';
  }

  if (controller_path !== undefined) {
    content += 'Calling controller "' + controller_path + '" (' + args.slice(controller_i).join(', ') + ')\n';
    content += '==============================\n';
    var controller = require(controller_path);
    content += controller(args.slice(controller_i));
  }
  else {
    content += "Did not find controller";
  }

  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end(content, 'utf-8');

}

var site_cache = {};

module.exports.load = function(directory) {

  directory = path.resolve(directory);

  if (site_cache.hasOwnProperty(directory)) {
    return site_cache[directory];
  }

  return new Site(directory);

}

