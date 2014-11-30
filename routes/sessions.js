var express = require('express');
var router = express.Router();
var passport = require('passport');
var auth = require('../config/auth');

/* Authenticates with password, returns a new token and user */
router.post('/',
  passport.authenticate('local', {session: false}), function(req, res) {
    res.send({token: auth.genToken(req.user), user: req.user});
  }
);

/* Authenticates with current token, returns a new token and user */
router.put('/',
  passport.authenticate('bearer', {session: false}), function(req, res) {
    res.send({token: auth.genToken(req.user), user: req.user});
  }
);

/* Authenticates with current token, returns user */
router.get('/', passport.authenticate('bearer', {session: false}), function(req, res) {
    return res.send({user: req.user});
});

/* TODO : A token revocation system (using .delete) */

module.exports = router;