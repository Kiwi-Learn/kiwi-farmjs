'use strict';
let express = require('express');
let router = express.Router();

router.put('/fetch/courselist', (req, res) => {
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

router.put('/fetch/courseserials', (req, res) => {
  let memCache = req.memClient;
  let got = req.got;
  got.get('http://www.sharecourse.net/sharecourse/api/android/courseserial')
	.then(response => {
    let serialMap = JSON.stringify(response.body);
    memCache.set('serialmap', serialMap, (err, val) => {
      let debug = require('debug')('memcache');
      if (err) debug(err);
      res.status(201).send('Created');
    }, 86400);
	})
	.catch(error => {
    res.status(500).send();
	});

});

module.exports = router;
