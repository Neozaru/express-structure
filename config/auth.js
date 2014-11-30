var jwt = require('jsonwebtoken');

var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var auth = {};

auth.init = function(passport, userGetter, options) {
    if (!options.token_secret) {
        new Error("Missing options.token_secret");
    }

    auth.token_secret = options.token_secret;

	passport.use(new LocalStrategy(userGetter));

    passport.use(new BearerStrategy(
        function(token, done) {
            jwt.verify(token, auth.token_secret, function(err, decoded_user) {
                return done(err, decoded_user);
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

};

auth.genToken = function(data) {
    if (!auth.token_secret) {
        new Error("Call 'auth.init()' before using this function");
    }
    return jwt.sign(data, auth.token_secret);
}

module.exports = auth;