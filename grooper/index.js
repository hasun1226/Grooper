var express = require('express');
var bodyParser = require('body-parser');
var models = require('./model/db'); //access each model by models
var autoIncrement = require("mongodb-autoincrement");
//var cobalt = require('cobalt-uoft');

var app = express();

// Set views path, template engine and default layout
app.use(express.static(__dirname + '/assets'));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');

// Parses the text as JSON and exposes the resulting object on req.body
app.use( bodyParser.json() ); 

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

// Get default page
app.get('/', function(req, res) {
  res.render('signin');
});

app.get('/register', function(req, res) {
	res.render('register');
});

app.get('/dashboard', function(req, res) {
	res.render('dashboard');
});

// Create user
app.post('/users', function (req, res) {
  // Validation
  if (!req.body.name || !req.body.email || !req.body.phone || !req.body.pw) {
	console.log("bad request");
    return res.sendStatus(400);
  }
  // Query database: first, check if email already exists
  db.collection('users').count({email: req.body.email}, function(err, count) {
    if (count > 0) {
      // Email already exists
	  console.log("already exists");
      return res.sendStatus(403);
    }
    // Insert into database
    autoIncrement.getNextSequence(db, 'users', function (err, autoIndex) {
      db.collection('users').insertOne({
        _id: autoIndex,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        pw: req.body.pw
      }, function(err, result) {
		return res.json({
			__id: result.insertedId,
			name: req.body.name,
			phone: req.body.phone,
			email: req.body.email,
			pw: req.body.pw
		});
	  });
    });
  });
});

app.post('/login', function(req, res) {
  // Validation: the input fields are empty
  if (!req.body.email || !req.body.pw)
    return res.sendStatus(400);
  // Query database
  db.collection('users').find({
    email: req.body.email,
    pw: req.body.pw
  }).toArray(function(err, docs) {
	  console.log(docs);
	// This set of email and pw doesn't exist
    if (docs.length == 0) {
		console.log(req.body);
      return res.sendStatus(403);
    }
	// Successfully logged in
	return res.json({
      userID: docs[0].id,
	  email: req.body.email,
	});
  });
});