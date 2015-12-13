'use strict';
let express = require('express');
let router = express.Router();

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
  let ks = req.kiwiscraper;
  ks.listCourses((err, courses) => {
    res.json(courses);
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
  let ks = req.kiwiscraper;
  ks.searchCourse(keyword, (err, found) => {
    if (found.length === 0) {
      res.redirect('/api/v1/searched/notfound');
    } else {
      res.json(found);
    }
  });
});

module.exports = router;
