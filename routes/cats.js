var express = require('express');
var router = express.Router();

var CatModel = require('../models/cat');
var cats = require('../controllers/cats')(CatModel);

router.get('/', cats.index);
router.get('/:id', cats.get);
router.post('/', cats.create);
router.put('/:id', cats.edit);
router.delete('/:id', cats.delete);

module.exports = router;
