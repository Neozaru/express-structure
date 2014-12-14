
var nodemailer = require('nodemailer');


var mails = {};

mails.init = function(transportConfig, options) {
	mails.transport = nodemailer.createTransport(transportConfig);
	mails.options = options || {};
	/* Server-specific static values for emails */
	mails.options.static_context = options.static_context || {};
};

mails.send = function(mailOptions, cb) {
	mails.transport.sendMail(mailOptions, cb);
};


module.exports = mails;