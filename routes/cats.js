var express = require('express');
var router = express.Router();
var cats = require('../controllers/cats')

router.get('/', cats.index);
router.get('/:id', cats.get);
router.post('/', cats.create);
router.put('/:id', cats.edit);
router.delete('/:id', cats.delete);

module.exports = router;
