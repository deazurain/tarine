
var fs = require('fs');
var path = require('path');

var Site = function(directory) {

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
    var p = path.resolve(directory, 'server.json');
    var json = fs.readFileSync(jsonPath, 'utf8');
    var properties = JSON.parse(json);
  } catch (e) {
    e.message = 'Website properties could not be found, read or parsed\n' + e.message;
    throw e;
  }

  this.properties = properties;
}

site_cache = {};

module.exports.load = function(directory) {

  directory = path.resolve(directory);

  if (hasOwnProperty(site_cache, directory)) {
    return site_cache[directory];
  }

  return new Site(directory);

}

	



