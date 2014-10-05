
var server = 'http://localhost:3000';

// GET without router
$.ajax({
  url: server + '/hi',
  type: 'GET',
  timeout: 3000,
  success: function(data) {
    var $h1 = $('<h1>').text(data);
    $h1.appendTo('body');
  },
  error: function(data) {
    var $h1 = $('<h1>').text("error");
    $h1.appendTo('body');
  }
});

// GET with router
$.ajax({
  url: server,
  type: 'GET',
  timeout: 3000,
  success: function(data) {
    var $h1 = $('<h1>').text(data);
    $h1.appendTo('body');
  },
  error: function(data) {
    var $h1 = $('<h1>').text("error");
    $h1.appendTo('body');
  }
});

// POST with router
$.ajax({
  url: server,
  type: 'POST',
  data: 'success post localhost:3000',
  timeout: 3000,
  success: function(data) {
    var $h1 = $('<h1>').text(data);
    $h1.appendTo('body');
  },
  error: function(data) {
    console.dir(data);
    var $h1 = $('<h1>').text("error");
    $h1.appendTo('body');
  }
});