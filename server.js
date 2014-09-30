// require http: this will allow us to create a server
var http = require('http');

// this function will be passed to our server to handle all http requests
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

// createes server and pipes requests to the request handler
// the handler then determines the appropriate response
var server = http.createServer(requestHandler);

// server now listening to requests on computer's port 3000
server.listen(3000);
