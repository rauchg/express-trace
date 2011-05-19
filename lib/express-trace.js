
/*!
 * express-trace
 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Export trace function.
 */

exports = module.exports = trace;

/**
 * Library version.
 */

exports.version = '0.0.1';

/**
 * Trace middleware in the given `app`.
 *
 * @param {express.HTTPServer} app
 * @api public
 */

function trace(app) {
  var stack = app.stack
    , len = stack.length;

  for (var i = 0; i < len; ++i) {
    stack[i].handle = (function(route, fn){
      return function(req, res, next){
        var route = route || '/'
          , name = fn.name || 'anonymous'
          , start = new Date;

        // middleware
        process.stderr.write('  \033[90mmiddleware\033[0m \033[33m'
          + route + '\033[0m \033[36m'
          + name + '\033[0m');

        // duration
        fn(req, res, function(err){
          console.error(' \033[90m%dms\033[0m', new Date - start);
          next(err);
        });
      }
    })(stack[i].route, stack[i].handle);
  }

  stack.unshift({
      route: ''
    , handle: function(req, res, next){
      console.error('\n  \033[90m%s\033[0m \033[33m%s\033[0m', req.method, req.url);
      next();
    }
  });

  stack.push({
      route: ''
    , handle: function(req, res, next){
      console.error('  \033[33m404\033[0m \033[90mno middleware responded to\033[0m \033[33m%s\033[0m', req.url);
      next();
    }
  });
  
  stack.push({
      route: ''
    , handle: function(err, req, res, next){
      console.error('  \033[31m500\033[0m \033[90mno middleware handled error\033[0m \033[31m%s\033[0m', err.message);
      next(err);
    }
  });
};