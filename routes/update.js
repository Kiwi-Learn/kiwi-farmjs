'use strict';
let express = require('express');
let router = express.Router();

router.put('/fetch', (req, res) => {
  let ks = req.kiwiscraper;
  let memCache = req.memClient;
  ks.listCourses((err, courses) => {
    let coursesArr = JSON.stringify(courses);
    memCache.set('courselist', coursesArr, (err, val) => {
      let debug = require('debug')('memcache');
      if (err) debug(err);
      res.status(201).send('Created');
    }, 86400);
  });
});

module.exports = router;
