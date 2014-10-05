
var methods = ["get","post","put","delete","all"];
var Layer = require('./layer');

var Route = function(path) {
  this.path = path;
  this.stack = [];

  // request method types handled
  this.methods = {};
};

methods.forEach(function(method) {
	Route.prototype[method] = function(fn) {
		var layer = new Layer('/',{}, fn);
		layer.method = method;
		this.methods[method] = true;
		this.stack.push(layer);
		return this;
	}
});

Route.prototype.dispatch = function(request,response,done) {
	var self = this;
  var idx = 0;
  var method = request.method.toLowerCase();
  next();
  function next(err){
  	var layer = self.stack[idx++];
  	if (!layer){
  		return;// done(err);
  	}
  	if (layer.method !== method){
  		return next(err);
  	}
  	if (!err){
      layer.handle_request(request, response, next);
  	}
  }
};

Route.prototype._handles_method = function(method){
	method = method.toLowerCase();
	return Boolean(this.methods[method]);
};

module.exports = Route;