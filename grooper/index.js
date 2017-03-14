var express = require('express');
var bodyParser = require('body-parser');
var models = require('./model/db'); //access each model by models
var autoIncrement = require("mongodb-autoincrement");

var app = express();

// Set views path, template engine and default layout
app.use(express.static(__dirname + '/assets'));
app.engine('.html', require('ejs').__express);
app.engine('js', require('ejs').renderFile);
app.set('views', __dirname);
app.set('view engine', 'html');

// Parses the text as JSON and exposes the resulting object on req.body
app.use( bodyParser.json() );
// Support URL-encoded bodies, req.query
app.use(bodyParser.urlencoded({ extended: true }));

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
		  _id: result.insertedId
		});
	  });
    });
  });
});

// Login should return something to keep the user session
app.post('/login', function(req, res) {
  // Validation: the input fields are empty
  if (!req.body.email || !req.body.pw)
    return res.sendStatus(400);
  // Query database
  db.collection('users').find({
    email: req.body.email,
    pw: req.body.pw
  }).toArray(function(err, docs) {
	  console.log(docs[0]);
	// This set of email and pw doesn't exist
    if (docs.length == 0) {
      return res.sendStatus(403);
    }
	// Successfully logged in
	return res.json( docs[0] );
  });
});

// Need testing
app.get('/search', function(req, res) {
  console.log(req.query);
  db.collection('polls').find(req.query).toArray(function(err, docs) {
    console.log(docs);
    return res.render('search', {
      "polls": docs,
      "course": req.query.course.toUpperCase()
    });
  });
});

app.post('/polls', function(req, res) {
  console.log(req.body);
  // Validation
  if (!req.body.creator || !req.body.title || !req.body.description || !req.body.course || !req.body.date || !req.body.size) {
	console.log("bad request");
    return res.sendStatus(400);
  }
  
  // Insert into database
  autoIncrement.getNextSequence(db, 'polls', function (err, autoIndex) {
    db.collection('polls').insertOne({
      _id: autoIndex,
      creator: req.body.creator,
      title: req.body.title,
      description: req.body.description,
      course: req.body.course,
	  date: req.body.date,
	  size: req.body.size,
	  questions: req.body.questions
    }, function(err, result) {
      return res.json({
        _id: result.insertedId
      });
	});
  });
});

// Need testing
app.get('/polls', function(req, res) {
  db.collection('polls').find({
    creator: req.body.uid
  }).toArray(function(err, docs) {
    console.log(docs);
	return res.json(docs);
  });
});

// Need testing
app.get('/polls/:pid', function(req, res) {
  db.collection('polls').find({
    _id: parseInt(req.params.pid)
  }).toArray(function(err, docs) {
    console.log(docs);
	return res.json(docs[0]);
  });
});

app.post('/groups/:pid', function(req, res) {
   
});

app.get('/groups/:uid', function(req, res) {
   db.collection('groups').find({
       members: {$in: [parseInt(req.params.uid)]}
   }).toArray(function(err, docs) {
    var groups = [];
    for (var i = 0; i < docs.length; i++){
        groups.push(docs[i].pid);
    }
    console.log(docs);
	return res.json({groups});
  });
});

app.post('/groups/:pid/member', function(req, res) {
   db.collection('groups').updateOne({
       pid: parseInt(req.params.pid),
       members: {$nin [req.uid]}
   },{
       $push: {members: req.uid}
   }, function(err, result){
       if(result.modifiedCount == 1){
           res.sendStatus(200);
       } else{
           res.sendStatus(403);
       }
   });
});

app.delete('/groups/:pid/member', function(req, res) {
   db.collection('groups').updateOne({
       pid: parseInt(req.params.pid),
       members: {$in [req.uid]}
   },{
       $pull: {members: req.uid}
   }, function(err, result){
       if(result.modifiedCount == 1){
           res.sendStatus(200);
       } else{
           res.sendStatus(403);
       }
   });
});

app.get('/groups/:pid', function(req, res) {
   db.collection('groups').find({
       pid: parseInt(req.params.pid)
   }).toArray(function(err, docs) {
    console.log(docs);
	return res.json(docs[0]);
  });
});

app.delete('/groups/:pid', function(req, res) {
    db.collection('groups').deleteOne({pid: parseInt(req.params.pid)});
    res.sendStatus(200);
});