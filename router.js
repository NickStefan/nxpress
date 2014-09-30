var url = require('url');

var extend = function(a,b) {
  for (var key in b) {
  	a[key] = b[key];
  }
  return a;
};

// create an object for our routes framework
var protoRouter = {};
// somewhere to associate request handlers with route url paths
protoRouter.routes = {};

// the app.use([urlString],[requestHandler]) invoked
// on server.js, applies this function with the same
// arguments and stores the requestHandler for later
protoRouter.use = function(urlString,requestHandler) {
  this.routes[urlString] = requestHandler;
};

// the nxpress 'super request handler' internally delegates to
// its own handle method, which in this case delegates to the
// router handle method. it parses the request.url string down 
// to the path string and looks up that path in the protoRouter.routes
// object and uses that associated request handler.
protoRouter.handle = function(request,response,next) {
  var path = url.parse(request.url)["pathname"];
  this.routes[path](request,response,next);
};

// this constructor function will take our protoRouter object
// and its methods, and add them as object properties to the main 
// function that is Router.

var createRouter = function () {
  var router = function(request,response,next) {
    router.handle(request,response,next);
  };
  extend(router,protoRouter);
  return router;
}

// set exports = to a constructor function.
module.exports = createRouter;
