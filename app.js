'use strict';
let express = require('express');
let logger = require('morgan');
let bodyParser = require('body-parser');
let KiwiScraper = require('kiwi-scraperjs');
var memjs = require('memjs');

const config = require('config');
const hasMemCachierConfig = config.has('MEMCACHIER');

let memClient = null;

if (hasMemCachierConfig) {
  memClient = memjs.Client.create(
    `${config.get('MEMCACHIER.username')}:${config.get('MEMCACHIER.password')}@${config.get('MEMCACHIER.server')}`);
} else {
  memClient = memjs.Client.create(
    `${process.env.MEMCACHIER_USERNAME}:${process.env.MEMCACHIER_PASSWORD}@${process.env.MEMCACHIER_SERVER}`);
}

let routes = require('./routes/index.js');
let course = require('./routes/course.js');
let update = require('./routes/update.js');

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// TODO
// Make our db accessible to our router
app.use((req, res, next) => {
  let ks = new KiwiScraper();
  req.kiwiscraper = ks;
  req.memClient = memClient;
  next();
});

app.use('/api/v1/fetch', (req, res, next) => {
  let opts = {
    forceUpdate: true,
  };
  let ks = new KiwiScraper(opts);
  req.kiwiscraper = ks;
  next();
});

app.use('/', routes);
app.use('/api/v1', course);
app.use('/api/v1', update);

/// catch 404 and forwarding to error handler
// app.use((req, res, next) => {
//   let err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

/// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use((err, req, res, next) => {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err,
//     });
//   });
// }

// production error handler
// no stacktraces leaked to user
// app.use((err, req, res, next) => {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {},
//   });
// });

module.exports = app;
