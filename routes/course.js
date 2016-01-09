'use strict';
const config = require('config');
const hasSCConfig = config.has('SHARECOURSE');
let express = require('express');
let router = express.Router();
let _ = require('lodash');
let moment = require('moment');

let videoCountAPI = null;

if (hasSCConfig) {
  videoCountAPI = config.get('SHARECOURSE.videoCountAPI');;
} else {
  videoCountAPI = process.env.SHARECOURSE_VIDEOCOUNTAPI;
}
/* GET Root path. */
router.get('/', (req, res) => {
  res.send(`Hello there!! This is Kiwi farm service. \
    Current API version is v1. Now we have deployed our service on Heroku. \
    Please feel free to explore it! \
    See Homepage at <a href="https://github.com/Kiwi-Learn/kiwi-farmjs"> \
    Github repo</a>`);
});

/* GET courses list. */
router.get('/courselist', (req, res) => {
  let memCache = req.memClient;
  memCache.get('courselist', (err, val) => {
    let debug = require('debug')('memcache');
    if (err) debug(err);
    if (!val || err) {
      let ks = req.kiwiscraper;
      ks.listCourses((err, courses) => {
        res.json(courses);
      });
    } else {
      let courses = JSON.parse(val.toString());
      res.json(courses);
    }
  });
});

/* GET not found course. */
router.get('/searched/notfound', (req, res) => {
  res.status(204).send('course not found');
});

/* GET course info from database. */
router.get('/searched/:id', (req, res) => {
  let ks = req.kiwiscraper;
  let courseID = req.params.id;
  ks.getCourseObjectByID(courseID, (err, courseObj) => {
    res.json(courseObj);
  });

  // TODO
  // This method need to find searched results in database

});

/* GET single course info. */
router.get('/info/:id.json', (req, res) => {
  let ks = req.kiwiscraper;
  let courseID = req.params.id;
  ks.getCourseObjectByID(courseID, (err, courseObj) => {
    res.json(courseObj);
  });
});

/* POST search courses with a keyword. */
router.post('/search', (req, res) => {
  let keyword = req.body.keyword;
  let sqsClient = req.sqsClient;
  sqsClient.push('Kiwi_messenger', keyword, (err) => {
    if (err) debug(err);
  });
  let ks = req.kiwiscraper;
  ks.searchCourse(keyword, (err, found) => {
    if (found.length === 0) {
      res.redirect('/api/v1/searched/notfound');
    } else {
      res.json(found);
    }
  });
});

/* POST course viewd a week. */
router.get('/couseserial/:serial', (req, res) => {
  let searchserial = req.params.serial;
  let memCache = req.memClient;
  let got = req.got;
  memCache.get('serialmap', (err, val) => {
    let debug = require('debug')('memcache');
    if (err) debug(err);
    if (!val || err) {
      res.status(204).send('No Content');
    } else {
      let serialmap = JSON.parse(val.toString());
      let matchcid = parseInt(serialmap[searchserial]);
      let options = {
        body: {
          courseId: matchcid,
          dayNumber: 7,
        },
        json: true,
      };
      got.post(videoCountAPI, options)
        .then(response => {
          let dateCountPair = [];
          let j = 0;
          for (let i of response.body.result) {
            let dateTmp = moment().subtract(j, 'days').format('MMM Do dddd');
            dateCountPair.push([dateTmp, i]);
            j += 1;
          }

          res.status(200).json({ results: dateCountPair });
        })
        .catch(error => {
          debug(error);
          res.status(500).send('Internal Error');
        });
    }
  });
});

module.exports = router;
