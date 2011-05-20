
/**
 * Module dependencies.
 */

var trace = require('../')
  , express = require('express')
  , app = express.createServer();

app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'foo' }));
app.use(express.static(__dirname));

function ensureUsername(name) {
  return function ensureUsername(req, res, next){
    setTimeout(function(){
      if (req.params.name == name) {
        next();
      } else {
        next('route');
      }
    }, Math.random() * 300);
  }
}

function rejectName(name) {
  return function rejectName(req, res, next){
    if (name == req.params.name) return res.send(401);
    next();
  }
}

app.get('/user/:name', rejectName('loki'));

app.get('/user/:name', ensureUsername('tj'), function(req, res, next){
  res.send('loaded tj');
});

app.get('/user/:name', function(req, res, next){
  setTimeout(next, 1000);
});

app.get('/user/:name', function(req, res, next){
  setTimeout(next, 200);
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