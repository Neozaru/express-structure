var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('root for the API');
});


/* Used as meta-router */
router.use('/cats', require('./cats'));
router.use('/sessions', require('./sessions'));
router.use('/users', require('./users'));

module.exports = router;
