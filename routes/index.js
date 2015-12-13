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

module.exports = router;
