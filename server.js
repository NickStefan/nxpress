var nxpress = require('./nxpress/nxpress');
var corsHeads = require('./nxpress/corsHeads');
var app = nxpress();

// Previous Commit
// in the last commit, we handed a basic request handler function
// to the nxpress 'super request handler function', by using the 
// app.use() api. this api then delegated the passed in 'basic request
// handler function' to a router 'function object' already inside of 
// nxpress. 

// In this commit:
// the basic request function, nxpress function object and the nxpress
// router function objects each have identical api's. This makes it very
// easy to separately instantiate a routes function object, and then 
// pass it to the app.use([urlString],[requestHandler]), where it
// will then be assigned to that urlString inside of nxpress's very own
// routes function object. This is exactly what we have done below:

// this is actually a router function object, just like the top level one
// instantiated inside of nxpress by default. However, this one being 
// required has actually been assigned a few routes inside of routes/index.js
// after it was instantiated there.
var routes = require('./routes/index');

// set the '/' urlString to be handled with routes function object
// you can also use a regex like /\w+/. this would match
// '/<alphanumeric of any length>'.
app.use('/', routes);

// direct routes still work as well
app.use('/hi',function(request,response) {
  response.writeHead(200,corsHeads);
  response.end("success get localhost:3000/hi");
});

console.log("server now listening on port 3000");
app.listen(3000);
