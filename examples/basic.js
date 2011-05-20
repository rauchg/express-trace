
/**
 * Module dependencies.
 */

var trace = require('../')
  , express = require('express')
  , app = express.createServer();

app.use(express.favicon());
app.use(express.static(__dirname));

function ensureUsername(name) {
  return function ensureUsername(req, res, next){
    if (req.params.name == name) {
      next();
    } else {
      next('route');
    }
  }
}

app.get('/user/:name', ensureUsername('tj'), function(req, res, next){
  res.send('loaded tj');
});

app.get('/user/:name', function(req, res, next){
  setTimeout(next, 1000);
});

app.get('/user/:name', function(req, res, next){
  next();
});

app.get('/user/tobi', function(req, res, next){
  res.send('loaded tobi');
});

app.get('/file/*', function(req, res, next){
  var file = req.params[0];
  res.send('requested ' + file);
});

app.get('/error', function(req, res, next){
  asdf();
});

trace(app);

app.listen(3000);