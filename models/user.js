var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var jsonSelect = require('mongoose-json-select');

var userSchema = mongoose.Schema({
    username: { type: String, required: true }
});

/* Will create schema fields : email, hash (password), salt (password) */
userSchema.plugin(passportLocalMongoose, {
	usernameField: "email",
	usernameLowerCase: true
});

/* Another cool plugin that controls JSON deserialization */
userSchema.plugin(jsonSelect, 'username email');

module.exports = mongoose.model('User', userSchema);