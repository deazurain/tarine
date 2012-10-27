
var tarine = module.exports;

// initialize some thingies
var pkg = require('./package.json');
tarine.version = pkg.version;
tarine.name = pkg.name;

// libraries
var site = require('./lib/site');

tarine.start = function(args) {

	console.log('Starting tarine webserver');

  var sites = {};

  args.forEach(function(path) {
    sites[path] = site.load(path);
  });

  console.log(sites);

}

