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
	  { type: String, required: true },
	curr_course:
	  [ code: { type: String, required: true } ],
	prev_course:
	  [ code: { type: String, required: true } ]
  },
  {
    collection: 'users'
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
	question: [{ 
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
    user: { type: Number, required: true },
	poll: { type: Number, required: true },
	status: { type: Number, required: true },
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
    id: { type: Number, required: true },
	member: { type: Number }
  },
  {
    collection: 'group'
  }
);

mongoose.connect('mongodb://localhost:3000/grooper');

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