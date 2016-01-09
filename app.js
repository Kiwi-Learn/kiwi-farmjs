'use strict';
let express = require('express');
let logger = require('morgan');
let bodyParser = require('body-parser');
let KiwiScraper = require('kiwi-scraperjs');
let memjs = require('memjs');
let sqs = require('sqs');
let got = require('got');

const config = require('config');
const hasMemCachierConfig = config.has('MEMCACHIER');
const hasAwsConfig = config.has('MEMCACHIER');

let memClient = null;
if (hasMemCachierConfig) {
  memClient = memjs.Client.create(
    `${config.get('MEMCACHIER.username')}:${config.get('MEMCACHIER.password')}@${config.get('MEMCACHIER.server')}`);
} else {
  memClient = memjs.Client.create(
    `${process.env.MEMCACHIER_USERNAME}:${process.env.MEMCACHIER_PASSWORD}@${process.env.MEMCACHIER_SERVER}`);
}

let sqsQueue = null;
if (hasAwsConfig) {
  sqsQueue = sqs({
    access: `${config.get('AWS_CREDENTIALS.accessKeyId')}`,
    secret: `${config.get('AWS_CREDENTIALS.secretAccessKey')}`,
    region: `${config.get('AWS_CREDENTIALS.region')}`,
  });
} else {
  // It will use env variables to configure
  // SQS_ACCESS_KEY
  // SQS_SECRET_KEY=
  // SQS_REGION
  sqsQueue = sqs({
    access: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
}

let routes = require('./routes/index.js');
let course = require('./routes/course.js');
let update = require('./routes/update.js');
let popularity = require('./routes/popularity.js');

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
  req.sqsClient = sqsQueue;
  req.got = got;
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
app.use('/api/v1', popularity);

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
