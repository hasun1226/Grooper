var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    _id: 
      { type: Number, required: true, unique: true },
    name:
	  { type: String, requried: true },
    email: 
	  { type: String, required: true },
    phone: 
	  { type: Number, required: true },
    pw: 
	  { type: String, required: true },
    course_history:
      [ { course: { type: String, required: true, unique: true },
          status: { type: Boolean, required: true } } ]
  },
  {
    collection: 'users'
  }
);

var PollSchema = new Schema (
  {
    _id: { type: Number, required: true, unique: true },
	creator: { type: Number, required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	size: { type: Number, required: true },
	date: { type: Date, required: true },
	course: { type: String, required: true },
	questions: [{ 
	  // id helpful to have for same question but different type/options
	  id: { type: Number, required: true }, 
	  // 0: open, 1: single-answer MC, 2: multiple-answers MC
	  q_type: { type: Number, required: true }, 
	  question: { type: String, required: true },
	  options: [{
	    value: { type: String, required: true }, 
		correct: Boolean
	  }]
	}]
  },
  {
    collection: 'polls'
  }
);

var ApplicationSchema = new Schema (
  {
    uid: { type: Number, required: true },
	pid: { type: Number, required: true },
	// 0: waiting, 1: invited, 2: accepted, 3: rejected/closed
	status: { type: Number, required: true },
	date: { type: Date, required: true },
	//answer is an array because it could have multiple answers
	answers: [{
	  question: { type: Number, required: true }, 
	  value: { type: String, required: true }
	}]
  },
  {
    collection: 'applications'
  }
);

var GroupSchema = new Schema (
  {
    pid: { type: Number, required: true },
	owner: { type: Number, required: true },
	members: [{ type: Number }],
	date: { type: Date, required: true }
  },
  {
    collection: 'group'
  }
);

mongoose.connect('mongodb://localhost/grooper');

//converting the schemas to models
var Users = mongoose.model('Users', UserSchema);
var Polls = mongoose.model('Polls', PollSchema);
var Applications = mongoose.model('Applications', ApplicationSchema);
var Groups = mongoose.model('Groups', GroupSchema);
module.exports = {
    Users: Users,
    Polls: Polls,
    Applications: Applications,
    Groups: Groups
};