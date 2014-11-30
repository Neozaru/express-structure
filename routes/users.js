var express = require('express');
var router = express.Router();
var passport = require('passport');

var UserModel = require('../models/user');
var users = require('../controllers/users')(UserModel);

/* Register user */
router.post('/', users.create);
/* Edit profile */
router.put('/:userid', passport.authenticate('bearer'), users.edit);
/* Delete account */
router.delete('/:userid', passport.authenticate('bearer'), users.delete);

/* Debugging */
router.get('/', users.index);
router.get('/:userid', users.get);
/**/

module.exports = router;
