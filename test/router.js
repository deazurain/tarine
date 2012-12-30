
var Router = require('../lib/router');

var router = new Router();

function handler(type, path) {
	var results = [];
	var ext = handler.extension(path);
	var extensions = handler.types[type];

	path = './' + type + '/' + path;

	if (!extensions) {
		throw new Error('type ' + type + ' not defined in handler.types');
	}

	// give defined extension precedence
	if (ext.length && extensions[ext]) {
		results.push(path);
	}

	// add a path for each extension
	for (var i = 0, l = extensions.length; i < l; i++) {
		results.push(path + '.' + extensions[i]);
	}

	return results;
}

handler.types = {
	'script': ['js'],
	'style': ['css', 'less']
};

/* allow looking up if a extension is contained for a type */
for (var key in handler.types) {
	var t = handler.types[key];
	for (var i = 0, l = t.length; i < l; i++) {
		t[t[i]] = true;
	}
}

handler.extension = function(path) {
	var match = /\.([a-z0-9]+)$/.exec(path);
	return match ? match[1] : '';
};

router.rule(/^\/(script)\/([\w\-\.]+(?:\/[\w\-\.]+)*)$/, handler);
router.rule(/^\/(style)\/([\w\-\.]+(?:\/[\w\-\.]+)*)$/, handler);

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
