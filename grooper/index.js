var express = require('express');
var bodyParser = require('body-parser');
var models = require('./model/db'); //access each model by models.Users/Polls/Applications etc
var app = express();


//----- COPIED FROM LAB 5 - NOT SURE WHAT IT'S DOING BUT IT DIDN'T WORK WITHOUT IT -----
// Set views path, template engine and default layout
app.use(express.static(__dirname + '/assets'));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');

//mongo
var MongoClient = require('mongodb').MongoClient;
var mongoURL = 'mongodb://localhost/grooper';
var db;
MongoClient.connect(mongoURL, function(err, database) {
  db = database;
  // Database is ready; listen on port 3000
  app.listen(3000, function () {
    console.log('App listening on port 3000');
  });
});

app.get('/', function(req, res) {
    res.render('register');
});

app.post('/signup', function(req, res) {
    res.send('do signup stuff here');
});