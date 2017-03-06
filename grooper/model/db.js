var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    id: 
	  { type: Number, required: true, unique: true },
    name:
	  { type: String, requried: true },
    email: 
	  { type: String, required: true },
    phone: 
	  { type: Number, required: true },
    pw: 
	  { type: String, required: true }
  },
  {
    collection: 'users'
  }
);

var CourseSchema = new Schema (
  {
	user: { type: Number, required: true },
	code: { type: String, required: true },
	current: { type: Boolean, required: true }
  },
  { 
    collection: 'course_history' 
  }
);

var PollSchema = new Schema (
  {
    id: { type: Number, required: true, unique: true },
	creator: { type: Number, required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	size: { type: Number, required: true },
	date: { type: Date, required: true },
	course: { type: String, required: true },
	
	// id helpful to have for same question but different type/options
	question: [{ 
	  // Need to make the fields required - DONE
	  id: {type: Number, required: true}, q_type: {type: Number, required: true}, question: {type: String, required: true},
	  options: [{
	    value: {type: String, required: true}, correct: Boolean
	  }]
	}]
  },
  {
    collection: 'polls'
  }
);

var ApplicationSchema = new Schema (
  {
    user: { type: Number, required: true },
	poll: { type: Number, required: true },
	status: { type: Number, required: true },
	answers: [{
	  question: {type: Number, required: true}, answer: [{ value: String }] //answer is an array because it could be a multiple choice question
	  
	}]
  },
  {
    collection: 'applications'
  }
);

var GroupSchema = new Schema (
  {
    id: { type: Number, required: true },
	member: { type: Number }
  },
  {
    collection: 'group'
  }
);

mongoose.connect('mongodb://localhost/grooper');

//converting the schemas to models
var Users = mongoose.model('Users', UserSchema);
//var Courses = mongoose.model('Courses', CourseSchema);
var Polls = mongoose.model('Polls', PollSchema);
var Applications = mongoose.model('Courses', ApplicationSchema);
var Groups = mongoose.model('Groups', GroupSchema);
module.exports = {
    Users: Users,
    //Courses: Courses,
    Polls: Polls,
    Applications: Applications,
    Groups: Groups
};