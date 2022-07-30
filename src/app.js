require('dotenv').config(); //.env 설정
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var discordRouter = require('./routes/discord/webhook');
app.use('/discord', discordRouter);

app.use('/discord/statics/css', express.static(path.join(__dirname, './views/statics/css')));
app.use('/discord/statics/images', express.static(path.join(__dirname, './views/statics/images')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;

  // render the error page
  res.status(500).send('error');
});

module.exports = app;
