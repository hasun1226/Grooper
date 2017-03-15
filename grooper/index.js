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

// Retrieve information about a user
app.get('/users/:uid', function(req, res) {
  db.collection('users').find({
    _id: parseInt(req.params.uid)
  }).toArray(function(err, result) {
    console.log(result);
    return res.json({
      name: result.name
      email: result.email
      phone: result.phone
    });
  });
});

// Delete a user
// TODO: Make sure only the user itself or an admin can delete the user
app.delete('/users/:uid', function(req, res) {
  db.collection('user').deleteOne({
    _id: parseInt(req.params.uid)
  }, function(err, result){
    if (result.deletedCount == 1){
      return res.sendStatus(200);
    }
    else {
      return res.sendStatus(403);
    }
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

// Add a new application
app.post('applications', function(req, res){
  // Validation
  if (!req.body.uid || !req.body.pid || !req.body.answers){
  	console.log("Error occured when adding application!");
  	return res.sendStatus(400);
  }
  // check if the poll exist
  db.collection('polls').count({
  	_id: req.body.pid
  }, function(err, count){
  	if (count == 0){
  	  return res.sendStatus(403);
  	}
  	// insert application into database
  	db.collection('applications').insertOne({
  	  uid: req.body.uid,
  	  pid: req.body.pid,
  	  status: 0, // 0 is waiting
  	  answers: req.body.answers
  	}, function(err, result){
  	  res.json({ // don't know if this is necessary
  	  	uid: req.body.uid,
  	  	pid: req.body.pid
  	  });
  	  // res.sendStatus(200);
  	});
  });
});

// delete application
app.delete('applications', function(req, res){
  db.collection('applications').deleteOne({
  	uid: req.body.uid,
  	pid: req.body.pid
  }, function(err, result){
  	if (result.deletedCount == 1){
  	  return res.sendStatus(200);
  	}
  	else {
  	  return res.sendStatus(403);
  	}
  });
});

// Get all the applications for a user
app.get('/applications/:uid', function(req, res){
  db.collection('applications').find({
  	uid: parseInt(req.params.uid)
  }).toArray(function(err, docs){
  	cosnsole.log(docs);
  	return res.json(docs)
  });
});

// update status of application
app.put('applications', function(req, res){
  //validation
  if (!req.body.uid || !req.body.pid)
  	return res.sendStatus(400);
  if (!req.body.status && !req.body.answers)
  	return res.sendStatus(400);

  // check if application exist just in case
  db.collection('applications').find({
  	uid: req.body.uid,
  	pid: req.body.pid
  }).toArray(function(err, docs){
  	if (docs.length == 0)
  	  return res.sendStatus(403);
  	var updateJSON = {}
	if (req.body.status)
	  updateJSON.status = req.body.status;
	if (req.body.answers)
	  updateJSON.answers = req.body.answers;
	db.collection('applications').updateOne({
	  uid: req.body.uid,
	  pid: req.body.pid
	}, {
	  $set: updateJSON
	}, function(err, result){
	  res.sendStatus(200);
	});
  })

});

//create a new group
app.post('/groups/:pid', function(req, res) {
  if(!req.body.creator){
    console.log('bad request');
    return res.sendStatus(400);
  }
  db.collection('groups')
  db.collection('groups').insertOne({
    pid: req.params.pid,
    members: [req.body.creator]
  }, function(err, result) {
    return res.sendStatus(200);
  });
});

//get all the groups for a user
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

//add a member to a group
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

//delete a member from a group
app.delete('/groups/:pid/member', function(req, res) {
   db.collection('groups').updateOne({
       pid: parseInt(req.params.pid),
       members: {$in [req.uid]}
   },{
       $pull: {members: req.uid}
   }, function(err, result){
       if(result.modifiedCount == 1){
           return res.sendStatus(200);
       } else{
           return res.sendStatus(403);
       }
   });
});

//get a group
app.get('/groups/:pid', function(req, res) {
   db.collection('groups').find({
       pid: parseInt(req.params.pid)
   }).toArray(function(err, docs) {
    console.log(docs);
	return res.json(docs[0]);
  });
});

//delete a group
app.delete('/groups/:pid', function(req, res) {
    db.collection('groups').deleteOne({
        pid: parseInt(req.params.pid)
    }, function(err, result){
        if(result.deletedCount == 1){
            return res.sendStatus(200);
        } else{
            return res.sendStatus(403);
        }
    });
});