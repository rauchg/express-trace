
/**
 * Module dependencies.
 */

var trace = require('../')
  , express = require('express')
  , app = express.createServer();

app.use(express.favicon());
app.use(express.static(__dirname));

app.get('/file/*', function(req, res, next){
  var file = req.params[0];
  res.send('requested ' + file);
});

app.get('/error', function(req, res, next){
  asdf();
});

trace(app);

app.listen(3000);