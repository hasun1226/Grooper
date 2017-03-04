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
	  { type: String }
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
	date: { type: date, required: true },
	course: { type: String, required: true },
	
	// id helpful to have for same question but different type/options
	question: [{ 
	  // Need to make the fields required
	  id: Number, q_type: Number, question: String, 
	  options: [{
	    value: String, correct: Boolean
	  }]
	}]
  },
  {
    collection: 'polls'
  }
);

var AppliactionSchema = new Schema (
  {
    user: { type: Number, required: true },
	poll: { type: Number, required: true },
	status: { type: Number }
	answers: [{
	  question: Number, answer: [{ value: String }]
	  
	}]
  }
  {
    collection: 'applications'
  }
);

var GroupSchema = new Schema (
  {
    id: { type: Number, required: true },
	member: { type: Number }
  }
  {
    collection: 'group'
  }
);

mongoose.connect('mongodb://localhost/grooper');

module.exports = mongoose.model('ta', TASchema);