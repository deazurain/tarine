
var Router = function() {
	this.regexes = [];
	this.callbacks = [];
	this.cach = {};
}
var p = Router.prototype;
module.exports = Router;

p.rule = function(regex, callback) {
	this.regexes.push(regex);
	this.callbacks.push(callback);
};

p.route = function(path) {
	var results = [];
	for (var i = 0, il = this.regexes.length; i < il; i++) {
		var match = this.regexes[i].exec(path);
		if (match) {
			var args = [];
			for (var j = 1, jl = match.length; j < jl; j++) { args.push(match[j]); }
			var result = this.callbacks[i].apply(match, args);
			if (result) {
				if (result instanceof Array) {
					results.push.apply(results, result);
				} else if (result instanceof String) {
					results.push(result);
				} else {
					throw Error('Router callback returned neither an Array nor a String');
				}
			}
		}
	}
	return results;
};

