// require nxpress and instantiate. this will abstract the server and 
// provide a framework. see the nxpress.js file
var nxpress = require('./nxpress');
var app = nxpress();
// this is the requestHandler that lived in this file second commit
var handleRequest = require('./requestHandler');

// set the '/' urlString to be handled with handleRequest function
app.use('/', handleRequest);

// app (and server) now listening to requests on computer's port 3000
console.log("server now listening on port 3000");
app.listen(3000);
