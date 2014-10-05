// pathRegexp is not built into node,
// but not wanting to get into the scope of regex,
// we will npm install this express dependency
var pathRegexp = require('path-to-regexp');


var Layer = function(path,options,fn) {
	// appoint a request handler function
	// to this path (and if in context, a method).
	options = options || {};
	this.handle = fn;
	this.path = path;
	this.regexp = pathRegexp(path, this.keys = [], options);
}

Layer.prototype.handle_request = function handle(request, response, next) {
	// actually use the request handle function appointed for this
	// route and method:
	try {
    this.handle(request,response,next);
	} catch (err) {
		next(err);
	}
};

Layer.prototype.match = function match(path) {
	// regexp object uses exec method to test the urlString ie path
  var matching = this.regexp.exec(path);
  if (!matching) {
  	return false;
  } // else
  return true;
};

module.exports = Layer;