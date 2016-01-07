'use strict';
let express = require('express');
let moment = require('moment');
let _ = require('lodash');
let Search = require('../models/search.js');
let router = express.Router();

/* POST popularity */
router.post('/popularity', (req, res) => {
  req.accepts(['application/json']);
  let todayPopularity = {
    date: moment().format('MM-DD-YYYY'),
    popularity: req.body.results,
  };

  Search.create(todayPopularity, function(err, pop) {
    if (err) console.error(err);
  });

  res.status(201).send('Created');
});

/* GET popularity */
router.get('/popularity/:date', (req, res) => {
  req.accepts(['application/json']);
  let date = req.params.date;
  Search
    .query(date)
    .exec((err, resp) => {
      if (err) console.error(err);

      if (resp.Count === 0) {
        res.sendStatus(204);
        return;
      }

      res.status(200).json({
        results: JSON.parse((_.pluck(resp.Items, 'attrs'))[0].popularity),
      });
    });
});

module.exports = router;
