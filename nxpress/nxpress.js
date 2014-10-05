var http = require('http');
var Router = require('./router');

var extend = function(a,b) {
  for (var key in b) {
  	a[key] = b[key];
  }
  return a;
};

var protoNxpress = {};

protoNxpress.listen = function(){
	var server = http.createServer(this);
	return server.listen.apply(server, arguments);
};

// in server.js we defined routes by using 
// app.use([urlString],[requestHandler]). in this commit, the request
// handler passed to app.use is actually itself a router object. routers
// have an identical api to any other request handler function. we pass this 
// request handler function, as arguments, directly to the router's own 
// router.use() method.this gives us the ability to nest routes in an 
// almost nested structure
protoNxpress.use = function(){
	var router = this.router;
  this.router.use.apply(router,arguments);
  return this;
};

// when actual requests come into the server, the nxpress 'super 
// request handler' delegates the request to the router.
// the router will know which of its own request handlers (or routers)
// to use based on the request handlers you have designated for each
// url when you previously called app.use([urlString],[requestHandler]])
// for each of your routes. 

// in this commit, some of these request handlers, being
// delegated to, will actually be their own routing functions that
// will further delegate to basic request handlers based on what 
// has been previously set.
protoNxpress.handle = function(request,response,done){
  this.router.handle(request,response,done);
};

protoNxpress.init = function() {
  this.router = new Router();
};

var createNxpress = function() {
  var app = function(request,response,next){
    app.handle(request,response,next);
  };
  extend(app,protoNxpress);
  app.init();
  return app;
};

// expose the router prototype to enable nesting of routes
createNxpress.Router = Router;

module.exports = createNxpress;
