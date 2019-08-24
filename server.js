
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('morgan');

var favicon = require('serve-favicon');
//var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var mysql = require('mysql2');

//var session = require('express-session');
//var ipfilter = require('express-ipfilter').IpFilter;

var cookieParser = require('cookie-parser');

require('dotenv').config();
console.log(process.env.APP_PORT);

var app = express();

// Blacklist the following IPs
//var ips = ['127.0.0.1'];

// all environments
app.set('port', process.env.APP_PORT);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon());
app.use(logger('dev'));



//app.use(methodOverride());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/teams',require('./routes/teams'))


if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log('Error handler', err);
    if(err){
      res.status(401);
      console.log(err);
    }else{
      res.status(err.status || 500);
    }

  //  res.render('error', {
  //    message: 'You shall not pass',
  //    error: err
  //  }
  });
  };

//The 404 Route (ALWAYS Keep this as the last route)
// app.get('*', function(req, res){
//     res.send('what???', 404);
//   });

// If no route is matched by now, it must be a 404


//var server = http.createServer(app);
// db.connect("TEST",function(err){
//   if (err) {
//
//     console.log('Unable to connect to MySQL.')
//     process.exit(1)
//   }else{
//
  //  server.listen(app.get('port'), function(){
    app.listen(process.env.APP_PORT, function() {
      console.log('Express server listening on port ' + process.env.APP_PORT);
    });

 //});

//open('http://127.0.0.1:'+process.env.APP_PORT);
