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
        pw: req.body.pw,
		course_history: []
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
    if (result.length == 0)
      return res.sendStatus(403);

    return res.json({
      name: result[0].name,
      email: result[0].email,
      phone: result[0].phone
    });
  });
});

// Retrieve course history of the user
app.get('/users/:uid/courses', function(req, res) {
  db.collection('users').find({
    _id: parseInt(req.params.uid)
  }).toArray(function(err, result) {
    if (result.length == 0)
      return res.sendStatus(403);

    return res.json({
      course_history: result[0].course_history
    });
  });
});

// Delete a user
// TODO: Make sure only the user itself or an admin can delete the user
app.delete('/users/:uid', function(req, res) {
  db.collection('users').deleteOne({
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

// Update user information (name, email, phone)
app.put('/users/:uid', function(req, res) {
  if (!req.body.name && !req.body.email && !req.body.phone && !req.body.pw)
    return res.sendStatus(400);

  var updateJSON = {};
  if (req.body.name)
    updateJSON.name = req.body.name;
  if (req.body.email)
    updateJSON.email = req.body.email;
  if (req.body.phone)
    updateJSON = req.body.phone;
  if (req.body.pw)
    updateJSON = req.body.pw;

  db.collection('users').updateOne({
    _id: parseInt(req.params.uid)
  }, {
    $set: updateJSON
  }, function(err, result) {
    if (result.matchedCount == 1) {
      res.sendStatus(200);
    } else {
      res.sendStatus(403);
    }
  });
});

// Add a course history information
app.post('/users/:uid/courses', function(req, res) {
  if (!req.body.course || !req.body.status)
    return res.sendStatus(400);

  db.collection('users').find({
    _id: parseInt(req.params.uid)
  }).toArray(function(err, docs) {
    // User does not exist
    if (docs.length == 0) {
      return res.sendStatus(403);
	}
	// Update only if the course is not in the course history
	db.collection('users').updateOne({
      _id: parseInt(req.params.uid),
      "course_history.course": { $nin: [req.body.course] }
	}, {
      $push: {course_history:
	    { course: req.body.course, status: req.body.status }
      }
    }, function(err, result){
      if(result.modifiedCount == 1){
        res.sendStatus(200);
      } else{
        res.sendStatus(403);
      }
	});
  });
});

// Delete a course history
app.delete('/users/:uid/courses', function(req, res) {
  if (!req.body.course)
    return res.sendStatus(400);

  db.collection('users').find({
    _id: parseInt(req.params.uid)
  }).toArray(function(err, docs) {
    // User does not exist
    if (docs.length == 0)
      return res.sendStatus(403);
  
    db.collection('users').updateOne({
      _id: parseInt(req.params.uid),
      "course_history.course": {$in: [req.body.course]}
    },{
      $pull: { course_history: { course: req.body.course } }
    }, function(err, result){
      if (result.modifiedCount == 1){
        return res.sendStatus(200);
      } else {
        return res.sendStatus(403);
      }
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

// Search polls in course
app.get('/search', function(req, res) {
  req.query.course = req.query.course.toUpperCase();
  db.collection('polls').find(req.query).toArray(function(err, docs) {
    // Sort by date: the first item is the most recently created/updated
    docs.sort(function(a, b) { 
      return a.date.getTime() < b.date.getTime(); 
    });
    return res.json(docs);
  });
});

// Create a poll
app.post('/polls', function(req, res) {
  // Validation
  if (!req.body.creator || !req.body.title || !req.body.description || !req.body.course || !req.body.size)
    return res.sendStatus(400);

  if (!req.body.questions)
    req.body.questions = [];
  // Check if the creator exists
  db.collection('users').find({
    _id: req.body.creator
  }).toArray(function(err, docs) {
    if (docs.length == 0)
      return res.sendStatus(403);
  });

  // Insert into database
  autoIncrement.getNextSequence(db, 'polls', function (err, autoIndex) {
    db.collection('polls').insertOne({
      _id: autoIndex,
      creator: req.body.creator,
      title: req.body.title,
      description: req.body.description,
      course: req.body.course,
	  date: new Date,
	  size: req.body.size,
	  questions: req.body.questions
    }, function(err, result) {
      return res.json({
        _id: result.insertedId
      });
	});
  });
});

// Get polls created by a user
app.get('/polls', function(req, res) {
  // Check if the user with uid exists
  db.collection('users').find({
    _id: req.body.uid
  }).toArray(function(err, docs) {
    if (docs.length == 0)
      return res.sendStatus(403);
  });
  db.collection('polls').find({
    creator: req.body.uid
  }).toArray(function(err, docs) {
    // Sort by date: the first item is the most recently created/updated
    docs.sort(function(a, b) { 
      return a.date.getTime() < b.date.getTime(); 
    });
	return res.json(docs);
  });
});

// Get a poll given the pid
app.get('/polls/:pid', function(req, res) {
  db.collection('polls').find({
    _id: parseInt(req.params.pid)
  }).toArray(function(err, docs) {
    // If the poll with pid doesn't exist
    if (docs.length == 0)
      return res.sendStatus(403);
    db.collection('applications').find({
      pid: parseInt(req.params.pid)
	}).toArray(function(error, result) {
      var target = {};
      var poll = docs[0];
      // Sort by date: the first item is the most recently created/updated
      result.sort(function(a, b) { 
        return a.date.getTime() < b.date.getTime(); 
      });

      for(var key in poll) target[key] = poll[key];
      target['applications'] = result;
      return res.json(target);
	});
  });
});

// Update a poll
app.put('/polls/:pid', function(req, res) {
  // Validation
  if (!req.body.creator && !req.body.title && !req.body.description && !req.body.size && !req.body.course && !req.body.questions)
    return res.sendStatus(400);

  // Set update JSON
  var updateJSON = {};
  if (req.body.title)
    updateJSON.title = req.body.title;
  if (req.body.description)
    updateJSON.description = req.body.description;
  if (req.body.size)
    updateJSON.size = req.body.size;
  updateJSON.date = new Date();
  if (req.body.course)
    updateJSON.course = req.body.course;
  if (req.body.questions)
    updateJSON.questions = req.body.questions;
  // Update
  db.collection('polls').updateOne({
    _id: parseInt(req.params.pid)
  }, {
    $set: updateJSON
  }, function(err, result) {
    if (result.matchedCount == 1) {
      res.sendStatus(200);
    } else {
      // The poll doesn't exist
      res.sendStatus(403);
    }
  });
});

// Delete a poll
app.delete('/polls/:pid', function(req, res) {
  db.collection('polls').deleteOne({
    _id: parseInt(req.params.pid)
  }, function(err, result){
    if(result.deletedCount == 1){
      return res.sendStatus(200);
    } else{
      return res.sendStatus(403);
    }
  });
});

// Add a new application
app.post('/applications', function(req, res){
  // Validation
  if (!req.body.uid || !req.body.pid || !req.body.answers)
  	return res.sendStatus(400);

  db.collection('polls').find({
  	_id: req.body.pid
  }).toArray(function(err, docs) {
    // Check if the poll exists
    if (docs.length == 0)
  	  return res.sendStatus(403);

    // Check if the applicant is the creator of the poll
    if (docs[0].creator == req.body.uid)
      return res.sendStatus(403);

	console.log(req.body);
  	// Insert application into database
  	db.collection('applications').insertOne({
  	  uid: req.body.uid,
  	  pid: req.body.pid,
  	  status: 0, // 0 is waiting
	  date: new Date(),
  	  answers: req.body.answers
  	}, function(err, result){
  	  return res.sendStatus(200);
  	});
  });
});

// Get all the applications for a user
app.get('/applications/:uid', function(req, res){
  // Check if the user with uid exists
  db.collection('users').find({
    _id: parseInt(req.params.uid)
  }).toArray(function(err, docs) {
    // Check if the user with uid exists
    if (docs.length == 0) {
      return res.sendStatus(403);
    } else {
      db.collection('applications').find({	
        uid: parseInt(req.params.uid)
      }).toArray(function(err, docs) {
        // Sort by date: the first item is the most recently created/updated
        docs.sort(function(a, b) { 
          return a.date.getTime() < b.date.getTime(); 
        });
	    return res.json(docs);
      });
    }
  });
});

// Update of application
app.put('/applications', function(req, res){
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
    updateJSON.date = new Date();
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

// delete application
app.delete('/applications', function(req, res){
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

// Create a new group
app.post('/groups', function(req, res) {
  if(!req.body.creator || !req.body.pid){
    // Creator is not given
    return res.sendStatus(400);
  }
  
  db.collection('polls').find({
    _id: req.body.pid
  }).toArray(function(err, docs) {
    // Poll does not exist
    if (docs.length == 0)
      return res.sendStatus(400);
    db.collection('users').find({
      _id: req.body.creator
    }).toArray(function(err, result) {
      // Creator does not exist or is not the creator of the poll
      if (result.length == 0 || result[0]._id != docs[0].creator)
        return res.sendStatus(400);
      db.collection('groups').find({
        pid: req.body.pid
      }).toArray(function (err, groups) {
        // Group with pid already exists
        if (groups.length > 0)
          return res.sendStatus(403);
        db.collection('groups').insertOne({
          pid: req.body.pid,
          owner: req.body.creator,
          members: [],
          date: new Date()
        }, function(fail, success) {
          return res.sendStatus(200);
        });			
      });
    });
  });
});

// Get all the groups for a user
app.get('/groups', function(req, res) {
  var uid = req.body.uid;
  
  db.collection('users').find({
    _id: uid
  }).toArray(function(err, docs) {
    // User does not exist
    if (docs.length == 0)
      return res.sendStatus(400);
    db.collection('groups').find({
      $or: [ { members: { $in: [ uid ] } }, { owner: { $in: [ uid ] } } ]
    }).toArray(function(error, result) {
      // Sort by date: the first item is the most recently created/updated
      result.sort(function(a, b) { 
        return a.date.getTime() < b.date.getTime(); 
      });
      var groups = [];
	  for (var i = 0; i < result.length; i++) {
        groups.push(result[i].pid);
      }
	  return res.json({ groups });
    });
  });
});

// Get a group
app.get('/groups/:pid', function(req, res) {
  db.collection('groups').find({
    pid: parseInt(req.params.pid)
  }).toArray(function(err, docs) {
    if (docs.length == 0)
      return res.sendStatus(400);
    return res.json(docs[0]);
  });
});

// Add a member to a group
app.post('/groups/:pid/member', function(req, res) {
  db.collection('users').find({
    _id: req.body.uid
  }).toArray(function(err, docs) {
    // User does not exist
    if (docs.length == 0)
      return res.sendStatus(400);
    db.collection('groups').find({
      pid: parseInt(req.params.pid)
    }).toArray(function (err, group) {
      // Cannot add a creator as a member
      if (group[0].owner == req.body.uid)
        return res.sendStatus(403);
      db.collection('groups').updateOne({
        pid: parseInt(req.params.pid),
        members: {$nin: [req.body.uid]}
      },{
        $push: {members: req.body.uid}
      }, function(err, result){
        if(result.modifiedCount == 1){
          res.sendStatus(200);
        } else{
          res.sendStatus(403);
        }
      });
	});
  });
});

// Delete a member from a group
app.delete('/groups/:pid/member', function(req, res) {
  if (!req.body.uid)
    return res.sendStatus(400);
  
  db.collection('groups').updateOne({
    pid: parseInt(req.params.pid),
    members: {$in: [req.body.uid]}
  },{
    $pull: {members: req.body.uid}
  }, function(err, result){
    if(result.modifiedCount == 1){
      return res.sendStatus(200);
    } else{
      return res.sendStatus(403);
    }
  });
});

//delete a group
app.delete('/groups/:pid', function(req, res) {
  db.collection('groups').deleteOne({
    pid: parseInt(req.params.pid)
  }, function(err, result){
    if (result.deletedCount == 1){
      return res.sendStatus(200);
    } else {
      return res.sendStatus(403);
    }
  });
});