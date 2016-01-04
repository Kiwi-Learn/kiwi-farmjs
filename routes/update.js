'use strict';
let express = require('express');
let router = express.Router();

router.put('/fetch', (req, res) => {
  let ks = req.kiwiscraper;
  ks.listCourses((err, courses) => {
    res.status(201).send('Created');
  });
});

module.exports = router;
