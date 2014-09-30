
// this is the same requestHandler that we originally had in 
// the main server file. instead of being "the one and only"
// request handler, it is now simple one request handler
// that can be associated with a route using
// app.use([urlSting],[requestHandler])

var requestHandler = function(request,response) {
  
  var headers = defaultCorsHeads;
  headers['Content-Type'] = "text/plain";
  var statusCode;

  if (request.url === '/' && request.method === 'GET') {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end("success");
  } else {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end("error page not found");
  }
};

// allow cross domain, such as localhost
var defaultCorsHeads = {
	"access-control-allow-origin":"*",
	"access-control-allow-methods":"GET, POST, PUT, DELETE, OPTIONS",
	"access-allow-headers":"content-type, accept",
	"access-control-max-age": 10 //seconds
}

module.exports = requestHandler;