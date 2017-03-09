var express = require('express');
var bodyParser = require('body-parser');
var models = require('./model/db'); //access each model by models
var app = express();

// Set views path, template engine and default layout
app.use(express.static(__dirname + '/assets'));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');

//mongo
var MongoClient = require('mongodb').MongoClient;
var mongoURL = 'mongodb://localhost:3000/grooper';
var db;
MongoClient.connect(mongoURL, function(err, database) {
  db = database;
  // Database is ready; listen on port 3000
  app.listen(3000, function () {
    console.log('App listening on port 3000');
  });
});

app.get('/', function(req, res) {
    res.render('signin');
});

app.post('/signup', function(req, res) {
    res.send('do signup stuff here');
});

app.post('/login', function(req, res) {
	res.render('dashboard');
});