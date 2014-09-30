var http = require('http');
var Router = require('./router');

// like _.extend()
var extend = function(a,b) {
  for (var key in b) {
  	a[key] = b[key];
  }
  return a;
};

// Important: functions are objects in javascript.
// they can have methods and properties.


// Build prototype of the framework/application as an object.
// this object's properties will eventually be added
// to a 'super request handler' function's object properties.
// this function and it's object methods will serve as
// access points to nxpress. the 'super request handler' will
// delegate to the router.

var protoNxpress = {};

// instead of manually setting an http server in the main server.js
// file, we abstract away the http.createServer(). http.createServer()
// takes a request handler function. Unlike passing a request handler 
// that actually does nitty gritty responding (as was done in the second
// commit of this repo), this request handler being passed is the 'super 
// request handler'. this 'super request handler' is the function that
// simply 'is' nxpress itself.
// therefore we pass the argument of this to the http listener.

protoNxpress.listen = function(){
	var server = http.createServer(this);
	return server.listen.apply(server, arguments);
};

// in server.js we define routes by using 
// app.use([urlString],[requestHandler]). we pass those arguments
// directly to the router's own router.use() method.
protoNxpress.use = function(){
	var router = this.router;
  this.router.use.apply(router,arguments);
  return this;
};

// when actual requests come into the server, the nxpress 'super 
// request handler' delegates the request to the router.
// the router will know which of its own request handlers to use
// based on the request handlers you have designated for each
// url when you previously called app.use([urlString,[requestHandler]])
// for each of your routes
protoNxpress.handle = function(request,response,done){
  this.router.handle(request,response,done);
};

// this will create a router instance that can begin storing
// route information when you call app.use([urlString],[requestHandler])
protoNxpress.init = function() {
  this.router = new Router();
};

// this constructor function will take our protoNxpress object
// and its methods, and add them as object properties to the 'super 
// request handler' function that is nxpress.

var createNxpress = function() {
  var app = function(request,response,next){
    app.handle(request,response,next);
  };
  extend(app,protoNxpress);
  app.init();
  return app;
};

// set exports = to a constructor function.
module.exports = createNxpress;
