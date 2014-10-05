var nxpress = require('../nxpress/nxpress');
var corsHeads = require('../nxpress/corsHeads');
var router = nxpress.Router();

// the urlString's used here can also be regex

// GET url
router.get('/', function(request,response) {
  response.writeHead(200,corsHeads);
  response.end("success get localhost:3000");
});

// POST url
router.post('/', function(request,response) {
  var data;
  request.on('data',function(chunk){
    data = chunk;
  });
  request.on('end',function(){
    response.writeHead(201,corsHeads);
    response.end(data)
  });
});

module.exports = router;
