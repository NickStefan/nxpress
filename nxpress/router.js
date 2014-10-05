var url = require('url');
var methods = ["get","post","put","delete","all"];
var Route = require('./route');
var Layer = require('./layer');

var extend = function(a,b) {
  for (var key in b) {
  	a[key] = b[key];
  }
  return a;
};

var protoRouter = {};

// last commit,
// we used a protoRouter.routes = {} as the only storage
// object to associate certain paths (as key names) with certain
// request handlers (functions). 

// in this commit, 
// we're going to additionally break up the routes by http method verb. we've
// set up the router.get() to be a function, that when defined will return 
// another function.
// the function invoked with "this.route(path)" will return an object 
// associated with the path. the object will map that path's http verbs
// with a request handle function.

// with an http method for each path, the api can then be:
// router.get([urlString],[requestHandler])
// router.post([urlString],[requestHandler]) etc
// this router can then be passed into the app.use([urlString],[router]) api.

methods.forEach(function(method){
	// this creates an api like protoRouter.get(), where a path,
	// and then at least one request handler, are captured from arguments
	// and then created as a single route.get(request handler);
  protoRouter[method] = function(path,fn){
  	var route = this.route(path);
  	route[method].apply(route,Array.prototype.slice.call(arguments,1));
  	return this;
  }
});

protoRouter.route = function(path){
  var route = new Route(path);

  // the route is stored in a "layer" rather than a 'routes to path object'.
  // to understand layers, imagine a monopoloy board game, and that each
  // cycle of request response means making a full lap around the board.
  // each layer is a square that we have to pass the request through.
  // if the layer is matched in some way, the request more deeply interacts
  // with that square.

  // route.dispatch(), binded here, later is used to iterate
  // the route's stack of layers. the layer then actually handles a route
  var layer = new Layer(path,{}, route.dispatch.bind(route));
  
  layer.route = route;
  this.stack.push(layer);
  return route;
};

protoRouter.use = function(urlString,requestHandler) {
  var layer = new Layer(urlString,{},requestHandler);
  // last commit, we associated our routes in an object by key of urlString.
  // this commit, we are creating a layer object to associate the path/function
  // and then pushing this layer onto a stack array.
  this.stack.push(layer);
};

protoRouter.match_layer = function(layer,request,response,done){
	var error = null;
	var path;
	try {
		path = url.parse(request.url).pathname;
		if (!layer.match(path)) {
			path = undefined;
		}
	} catch (err) {
		error = err;
	}
	done(error, path);
}

protoRouter.handle = function(request,response,done) {
	var self = this;
  var idx = 0;
  next();

  // the next() function performs recursive iteration through the router's
  // stack array. each recursive call of next() increments the idx variable,
  // and the recursive calls stop as soon as layer = undefined.
  function next(){
    var layer = self.stack[idx++];
    // if the stack of routes is finished
    if (!layer){
    	return;// done();
    }
    // try to match this layer with the request url
    self.match_layer(layer,request,response,function(err,path){
      if (err || path === undefined) {
      	// no match, go to the next stack layer
      	return next(err);
      }
      
      // at this point, we know that this layer matches by path.
      // this path could either be a middleware, a router, or a route.
      // if its a middleware, or a router, its not going to have a 
      // route property, and we will dispatch to this matched layer's
      // request handler regardless.
      //
      // if this layer is a single route (ie a request handler that
      // we have defined as router.get("/",function(){})), then we
      // need to check if its method matches with the request method
      // before dispatching to this layer's request handler

      var route = layer.route;

      if (route) {
	      var method = request.method;
	      var has_method = route._handles_method(method);

	      if (!has_method) {
	      	next();
	      } else {
          // its a single route, and it matches request.method,
          // dispatch to the request handler
	        return layer.handle_request(request,response,next);
	      }

      // not a single route, but a router or middleware that matches
      // this path nonetheless
	    } else {
	    	return layer.handle_request(request,response,next);
	    }
    });
  }
};


// this constructor function will take our protoRouter object
// and its methods, and add them as object properties to the main 
// function that is Router.

// besides being instantiated inside nxpress as the top level routing
// handler, this router can also be instantiated completely outside
// nxpress. this routing function can then be passed back into nxpress
// using the app.use([urlString],[requestHandler]) api. this makes
// it easy to nest your routes

var createRouter = function () {
  var router = function(request,response,next) {
    router.handle(request,response,next);
  };
  extend(router,protoRouter);
  router.stack = [];
  this.methods = {};
  return router;
}

module.exports = createRouter;
