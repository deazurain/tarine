
var tarine = {};

// initialize some thingies
var pkg = require('./package.json');
tarine.version = pkg.version;
tarine.name = pkg.name;

// libraries
var site = require('./lib/site');

tarine.start = function(args) {

	console.log('Starting ' + tarine.name + '@' + tarine.version + ' webserver...');

  var sites = {};

  args.forEach(function(path) {
    try {
      var s = site.load(path);
      sites[s.directory] = s;
    } catch (e) {
      console.log('Failed to load website "' + path + '", ');
      console.log(e);
    }
  });

  console.log('Starting websites...');
  for(dir in sites) {
    sites[dir].start();
  }

}

module.exports = tarine;
