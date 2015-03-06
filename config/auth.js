var jwt = require('jsonwebtoken');

var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var auth = {};

auth.init = function(passport, userGetter, options) {
    if (!options.token_secret) {
        return new Error("Missing options.token_secret");
    }
    auth.options = options;

	passport.use(new LocalStrategy({usernameField: 'email'}, userGetter));

    passport.use(new BearerStrategy(
        function(token, done) {
            jwt.verify(token, auth.options.token_secret, function(err, decoded_user) {
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
    if (!auth.options) {
        new Error("Call 'auth.init()' before using this function");
    }
    return jwt.sign(data, auth.options.token_secret, {expiresInMinutes: auth.options.expiresInMinutes || 1440});
}

module.exports = auth;