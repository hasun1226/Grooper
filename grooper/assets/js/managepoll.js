$(document).ready(function() {
	var pid = location.search.substr(5);
	
	qNo = 0;
	var q_data = [];
	
	$.ajax({
      url: '/polls/' + pid,
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      success: function(response) {
		document.getElementById('inputProjectTitle').value = response.title;
		document.getElementById('inputProjectDesc').defaultValue = response.description;
		document.getElementById('groupSize').value = response.size;
		
		var qs = $('<div></div>');
		var questions = response.questions;

		for (var i=0; i<questions.length; i++) {
		  var q = questions[i];
		  var form_div = $('<div class="form-group" id='+ q.id + '></div>');
		  if (q.q_type == 0) {
		    form_div.append('<label for="textarea_answer">'+ q.question +'</label><textarea class="form-control" rows="3" required></textarea>');
			q_data.push(q);
		  } else if (q.q_type == 1) {
		    form_div.append('<div class="row"><label class="col-xs-12">'+ q.question +'</label></div>');
		    for (var j=0; j<q.options.length; j++) {
			  var opt = q.options[j];
			  var item = $('<label class="radio-inline"><input type="radio" name="radio' + q.id + '" value="' + opt.value + '" required/>' + opt.value + '</label>');
			  if (opt.correct) {
				item.find("input").prop("checked", true);
			  }
			  form_div.append(item);
		    }
			q_data.push(q);
		  } else {
		    form_div.append('<div class="row"><label class="col-xs-12">'+ q.question +'</label></div>');
		    for (var j=0; j<q.options.length; j++) {
			  var opt = q.options[j];
			  var item = $('<label class="checkbox-inline"><input type="checkbox" name="checkbox' + q.id + '" value="' + opt.value + '" required/>' + opt.value + '</label>');
		      if (opt.correct) {
				  item.find("input").prop("checked", true);
			  }
			  form_div.append(item);
		    }
			q_data.push(q);
		  }
		  qs.append(form_div);
		  qNo++;
		}
		
		if (response.applications.length > 0) {
			for (var i=0; i< response.applications.length; i++) {
			// Get applicant's name
				var application = response.applications[i]
				$.ajax({
					url: '/users/' + application.uid.toString(),
					dataType: "json",
					contentType: "application/json; charset=UTF-8",
					success: function(applicant) {
						var f_div = $('<div class="row">');
						var item = $('<div class="input-group item">');
						var app = $('<a href="#" class="form-control applicant" data-app="' + application.uid + '" onclick="view(this)">').text(applicant.name);
						var span = $('<span class="input-group-btn">');
						span.append('<button type="submit" class="invite btn btn-success" onclick="invite(this)">Invite</button>');
						item.append(app);
						item.append(span);
						
						console.log(item.html());
						
						f_div.append(item);				
						$('#applicants').append(f_div);
					}
				});
			}
		} else {
			var f_div = $('<div class="row">');
			var item = $('<div class="input-group item">').text("Please wait until an applicant appears");
			f_div.append(item);
			$('#applicants').append(f_div);
		}
		
		$('.questions').prepend(qs);
		// Get creator's name
          $.ajax({
            url: '/users/' + response.creator.toString(),
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            success: function(creator) {
				document.getElementById('host').innerHTML = "Host: " + creator.name;
			}
		  });
		
		// CSS style
		$('.applicant').mouseleave(function() {
		// Get rid of the effect after clicking the anchor
		$(this).css('box-shadow', 'none')
		$(this).css('text-decoration', 'none')
		$(this).css('color', '#555555')
		$(this).css('border', '1px solid #ccc')
		});
	  }
	})

  // Edit the poll
  $('.edit').on('click', function() {
	var title = document.getElementById('inputProjectTitle').value;
	var slots = document.getElementById('groupSize').value;
	var desc = document.getElementById('inputProjectDesc').value;
	
	// Questions that are newly added
	$('.newly_added').find('.remove-question').remove();
    var questions = $('.newly_added').clone();
	
    questions.each(function() {
	  var q_id = parseInt(this.id);
	  var question = $(this).find('.col-xs-12').text();
	  var rad_opt = $(this).find(".radio-inline");
	  var cb_opt = $(this).find(".checkbox-inline");
	  if ($(this).find("textarea").length > 0){
		  var q = {"id":q_id, "q_type":0, "question":question}
		  q_data.push(q);
	  } else if (rad_opt.length > 0) {
		  var options = [];
		  rad_opt.each(function() {
			var o = {"value":$(this).text().trim(''), "correct":$(this).children(":first").prop("checked")}
			options.push(o); 
		  });
		  var q = {"id":q_id, "q_type":1, "question":question, "options":options}
		  q_data.push(q);
	  } else if(cb_opt.length > 0) {
		  var options = [];
		  cb_opt.each(function() {
			var o = {"value":$(this).text().trim(''), "correct":$(this).children(":first").prop("checked")}
			options.push(o); 
		  });
		  var q = {"id":q_id, "q_type":2, "question":question, "options":options}
		  q_data.push(q);
	  }
    
    });
	
	$.ajax({
		url: "/polls/" + pid,
		type: "PUT",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({
			"title": title,
			"description": desc,
			"size": parseInt(slots),
			"date": new Date(),
			"questions": q_data
		}), statusCode:{
			200: function(res){
				console.log("Poll is updated");
				alert("Your poll has been modified!");
				window.location.reload();
			}
		}
	});
  });


  //Create questions
  $('.add').on('click', function() {
	// Generates questions
	qNo++;
	
	if (document.getElementById('inputQuestion').value.trim() != '') {
		var division = document.createElement('div');
		division.className = 'row';
		var label = document.createElement('label');
		label.labelfor = 'new_question';
		label.className = 'col-xs-12';
		label.innerHTML = document.getElementById('inputQuestion').value;
		var remove = document.createElement('span');
		remove.className = "remove-question btn glyphicon glyphicon-trash";
		remove.onclick = function(){
			remove.parentNode.parentNode.parentNode.remove();
		};
		label.appendChild(remove);
		division.appendChild(label);
		
		var form_div = document.createElement('div');
		form_div.className ='form-group newly_added';
		form_div.setAttribute('id', qNo);
		form_div.append(division);
	
		var type = document.getElementById('question_type');
		if (type.options[type.selectedIndex].value == 'text') {
			var question = document.createElement('textarea');
			question.rows = '3';
			question.className = "form-control";
			form_div.append(question);
		} else if (type.options[type.selectedIndex].value == 'MC') {
			
            var instruction = document.createElement('p');
            instruction.textContent = "Select the option that you wish to make as answer";
            form_div.append(instruction);
			
			var options = prompt("Please enter all the values for the answer separated by commas").split(",");
			options.forEach(function createQuestion(value) {
				if (value.trim() != '') {
					var radio_inline = document.createElement('label');
					radio_inline.className = 'radio-inline';
					radio_inline.textContent = ' ' + value.trim();
					var question = document.createElement('INPUT');
					question.type = 'radio';
					question.setAttribute('name', 'radio' + qNo);
					radio_inline.prepend(question);
					form_div.append(radio_inline);
				}
			});
			
		} else {
			
			var instruction = document.createElement('p');
            instruction.textContent = "Select the option(s) that you wish to make as answer";
            form_div.append(instruction);
			
			var options = prompt("Please enter all the values for the answer separated by commas").split(",");
			options.forEach(function createQuestion(value) {
				if (value.trim() != '') {
					var cb_inline = document.createElement('label');
					cb_inline.className = 'checkbox-inline';
					cb_inline.textContent = ' ' + value.trim();
					var question = document.createElement('INPUT');
					question.type = 'checkbox';
					cb_inline.prepend(question);
					form_div.append(cb_inline);
				}
			});
		}
	
	var referenceNode = document.getElementById('insertbefore');
	referenceNode.parentNode.insertBefore(form_div, referenceNode.previousSibling);
		
	}
	document.getElementById('inputQuestion').value = '';
  });
});

function invite(app) {
	var applicant = app.parentNode.previousSibling;
	var uid = applicant.getAttribute('data-app');
	var pid = location.search.substr(5);
	
	if (confirm('Do you want to invite ' + applicant.innerHTML + ' to your group?')) {
	  // Send invitation to the applicant!
	  $.ajax({
	  	url: '/applications',
	  	type: "PUT",
	  	dataType: "json",
	  	contentType: "application/json; charset=UTF-8",
	  	data: JSON.stringify({
	  		uid: parseInt(uid),
	  		pid: parseInt(pid),
	  		status: 1
	  	}),
	  	statusCode:{
	  		200: function(res){
				alert("You have invited " + applicant.innerHTML);
	  			console.log("updated user " + uid +" to group successfully");
				window.location.reload();
	  		},
	  		403: function(res){
	  			console.log("error in updating application");
	  		}
	  	}
	  });
	}
}


function view(app) {
	var uid = parseInt(app.getAttribute('data-app'));
	var pid = location.search.substr(5);
	$('.applicant_title').text(app.innerHTML);
	
	$('#Responses').modal('show');	
	
	// Retrieve poll info
    $.ajax({
      url: '/polls/' + pid,
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      success: function(response) {
		//console.log(response);
		var applications = response.applications;
		var answers = applications[ind_app(applications, uid)].answers;

		var par = $('#applicant-form');
		par.append('<h3 style="margin-bottom: 20px;">Responses</h3>');
		
		// render questions
		var questions = response.questions;
		
		for (var i=0; i<questions.length; i++) {
		  var q = questions[i];
		  var form_div = $('<div class="form-group"></div>');
		  form_div.attr('id', 'Q' + q.id);
		  // Open Q
		  if (q.q_type == 0) {
		    form_div.attr('data-qtype', 0);
			form_div.append('<label for="textarea_answer">' + q.question + '</label><textarea id="textarea-' + q.id + '" class="form-control" rows="3" disabled=true></textarea>');
		  } 
		  // Single MC Q
		  else if (q.q_type == 1) {
		    form_div.attr('data-qtype', 1);
		    form_div.append('<div class="row"><label class="col-xs-12">'+ q.question +'</label></div>');
		    for (var j=0; j<q.options.length; j++) {
			  var opt = q.options[j];
		      form_div.append('<label class="radio-inline"><input type="radio" name="radio' + q.id + '" value="' + opt.value + '" disabled=true>' + opt.value + '</label>');
		    }
		  }
		  // Multiple MC Q
		  else {
		    form_div.attr('data-qtype', 2);
		    form_div.append('<div class="row"><label class="col-xs-12">'+ q.question +'</label></div>');
		    for (var j=0; j<q.options.length; j++) {
			  var opt = q.options[j];
		      form_div.append('<label class="checkbox-inline"><input type="checkbox" name="checkbox' + q.id + '" value="' + opt.value + '" disabled=true>' + opt.value + '</label>');
		    }		    
		  }
		  par.append(form_div);
		}		
		for (var i = 0; i<answers.length; i++) {
			var qid = answers[i].question;
			var q = document.getElementById('Q' + qid);
			
			// Open Questions
			if (q.getAttribute('data-qtype') == 0) {
				$('#Responses').find('#textarea-' + qid).val(answers[i].value);
			}
			// MC Questions
			else {
				var opt = q.querySelector('label>input[value="' + answers[i].value + '"]');
				opt.checked = true;
			}
		}
	  }
	});
	
};

// Logout
$('#logout').click(function () {
  document.cookie = '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  localStorage.removeItem('userID');
});

// Returns the index of the user's applicaion in applications
var ind_app = function(applications, uid) {
	if (!applications) return -1; // empty
	if (applications.length == 0) return -1; // empty
	for (var i=0; i<applications.length;i++) {
		if (applications[i].uid == uid) {
			return i; // Contains
		} else {
			return -1; // Not applied
		}
	}
}