var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');

var routes = require('./routes/index');
var api = require('./routes/api');
var passport = require('passport');

var auth = require("./config/auth");

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mydb');
var appFunc = function(staticPath) {

staticPath = staticPath || path.join(__dirname, 'public')
// view engine setup
var app = express();
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(staticPath));
app.use(compression());
app.use(passport.initialize());
app.use('/', routes);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send(err);
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err);
});

return app;
};
module.exports = appFunc;
