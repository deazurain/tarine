
var Router = require('../lib/router');

var router = new Router();

var staticHandler = (function() {

	var self = function(type, path) {
		var results = [];
		var ext = self.extension(path);
		var extensions = self.types[type];

		path = './' + type + '/' + path;

		if (!extensions) {
			throw new Error('type ' + type + ' not defined in handler.types');
		}

		// give defined extension precedence
		// but allow file.less to be file.less,
		// file.less.css and file.less.less
		if (ext.length && extensions[ext]) {
			results.push(path);
		}

		// add a path for each extension
		for (var i = 0, l = extensions.length; i < l; i++) {
			results.push(path + '.' + extensions[i]);
		}

		return results;
	}

	self.types = {
		'script': ['js'],
		'style': ['css', 'less']
	};

	/* allow looking up if a extension is contained for a type */
	for (var key in self.types) {
		var t = self.types[key];
		for (var i = 0, l = t.length; i < l; i++) {
			t[t[i]] = true;
		}
	}

	self.extension = function(path) {
		var match = /\.([a-z0-9]+)$/.exec(path);
		return match ? match[1] : '';
	};

	return self;
}());

router.rule(/^\/(script)\/([\w\-\.]+(?:\/[\w\-\.]+)*)$/, staticHandler);
router.rule(/^\/(style)\/([\w\-\.]+(?:\/[\w\-\.]+)*)$/, staticHandler);

console.log(router.route('/script/valid'));
console.log(router.route('/script/valid.js'));
console.log(router.route('/script/dir/valid.js'));
console.log(router.route('/script/dir/subdir/valid'));

console.log(router.route('/style/valid'));
console.log(router.route('/style/valid.js'));
console.log(router.route('/style/dir/valid.js'));
console.log(router.route('/style/dir/subdir/valid'));

console.log(router.route('/script//invalid'));
console.log(router.route('/script/inv#l|d.js'));
console.log(router.route('/script/dir/invalid.js/'));
console.log(router.route('script/dir/subdir/invalid.'));

console.log(router.route('/style//invalid'));
console.log(router.route('/style/inv#l|d.js'));
console.log(router.route('/style/dir/invalid.js/'));
console.log(router.route('style/dir/subdir/invalid.'));

console.log(router.route('/nonexistant/dir/subdir/invalid'));
