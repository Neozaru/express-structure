var mongoose = require('mongoose');
var passportLocalMongoose = require('../lib/passport-local-mongoose/lib/passport-local-mongoose');
var jsonSelect = require('mongoose-json-select');
var mongooseToken = require('mongoose-token');
var validator = require('validator');

var userSchema = mongoose.Schema({
    username: { type: String, required: true },
    activated: { type: Boolean, required: true, default: false}
});


var myPasswordValidator = function(password, cb) {
	if (!validator.isLength(password, 4, 32)) {
		return cb("Password should be between 4 and 32 chars");
	}
	return cb(null);
}

userSchema.plugin(mongooseToken);

/* Will create schema fields : email, hash (password), salt (password) */
userSchema.plugin(passportLocalMongoose, {
	usernameField: "email",
	usernameLowerCase: true,
	passwordValidator: myPasswordValidator
});

/* Another cool plugin that controls JSON deserialization */
userSchema.plugin(jsonSelect, 'username email');


userSchema.static('requestActivation', function (email, cb) {
  this.findOne({email: email, activated: false}).exec().then(function (user) {
    if (!user) { 
    	return cb("Can't request activation : Unknown account or account already activated.");
    }
    return user.setToken(cb);
  });
});

userSchema.static('activate', function (email, token, cb) {
  this.getByToken(token, {email: email, activated: false}).then(function (user) {
    if (!user) { 
    	return cb("Can't activate account : Bad token or account already activated.");
    }
    user.activated = true;
    return user.resetToken(cb);
  });
});

module.exports = mongoose.model('User', userSchema);