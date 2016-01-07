'use strict';
let express = require('express');
let moment = require('moment');
let Search = require('../models/search.js');
let router = express.Router();

/* POST popularity */
router.post('/popularity', (req, res) => {
  let todayPopularity = {
    date: moment().format('MM-DD-YYYY'),
    popularity: JSON.stringify(req.body),
  };

  Search.create(todayPopularity, function(err, pop) {
    if (err) console.error(err);
  });

  res.status(201).send('Created');
});

module.exports = router;
