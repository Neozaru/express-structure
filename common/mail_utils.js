var path = require('path');
var emailTemplates = require('email-templates');
var winston = require('winston');
var templatesDir = path.join(__dirname, '../templates');
var mails = require('../config/mails');

var mail_utils = {};

mail_utils.getBaseOptions = function() {
    return {
        from: mails.options.defaultFrom || 'foo@mail.org'
    }
};

mail_utils.renderActivationMail = function(user, cb) {
    /* Performance issues */
    emailTemplates(templatesDir, function(err, template) {
        if (err) {
            return cb(err);
        }
        // Render a single email with one template
        var context = {user: user, statics: mails.options.static_context};

        template('activation_mail', context, function(err, html, text) {
            return cb(err, html, text)
        });

    });
};

mail_utils.sendActivationMail = function(user, cb) {
    mail_utils.renderActivationMail(user, function(err, html, text) {
        if (err) {
            return cb(err);
        }

        var mailOptions = mail_utils.getBaseOptions();
    
        mailOptions.to = user.email;
        mailOptions.subject = 'Welcome ' + user.username + ', activate your account';
        mailOptions.text = text,
        mailOptions.html = html;

        mails.send(mailOptions, function(err, info) {
            winston.log("Sent mail");
            winston.log(info);
            if (err) {
                winston.error(err);
            }

            cb(err, info);
        });
    });
};

module.exports = mail_utils;