'use strict';
let express = require('express');
let logger = require('morgan');
let bodyParser = require('body-parser');
let KiwiScraper = require('kiwi-scraperjs');

let routes = require('./routes/index.js');
let course = require('./routes/course.js');

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// TODO
// Make our db accessible to our router
app.use((req, res, next) => {
  let ks = new KiwiScraper();
  req.kiwiscraper = ks;
  next();
});

app.use('/', routes);
app.use('/api/v1', course);

/// catch 404 and forwarding to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

module.exports = app;
