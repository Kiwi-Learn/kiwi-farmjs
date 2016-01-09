'use strict';
const config = require('config');
const hasSCConfig = config.has('SHARECOURSE');
let express = require('express');
let router = express.Router();

let courseSerialAPI = null;

if (hasSCConfig) {
  courseSerialAPI = config.get('SHARECOURSE.courseSerialAPI');
} else {
  courseSerialAPI = process.env.SHARECOURSE_COURSESERIALAPI;
}

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
  got.get(courseSerialAPI)
    .then(response => {
      // should be parse serialMap to JSON but SC return string
      let serialMap = response.body;
      memCache.set('serialmap', serialMap, (err, val) => {
        let debug = require('debug')('memcache');
        if (err) debug(err);
        res.status(201).send('Created');
      }, 86400);
    }).catch(error => {
      res.status(500).send();
    });
});

module.exports = router;
