$(document).ready(function() {
  course = location.search.substr(8).toUpperCase();
  var uid = localStorage.getItem('userID');
  
  if (course) {
    $('.course').text(course);
    if ($('.found').text() == "true"){
      $.ajax({
        url: '/polls?course=' + course,
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        success: function(response){
          let parent = $('#polls');
          for (let i = 0; i < response.length; i++) {
            let tmp = $('<tr data-toggle="modal" data-id=' + response[i]._id + ' data-target="#orderModal">');
    
            // Get creator's name
            $.ajax({
              url: '/users/' + response[i].creator.toString(),
              dataType: "json",
              contentType: "application/json; charset=UTF-8",
              success: function(creator) {
                tmp.append($('<td class="group-host col-md-3">' + creator.name + '</td>'));
                tmp.append($('<td class="group-name col-md-6">' + response[i].title + '</td>'));
                tmp.append($('<td class="col-md-3">' + response[i].date.substr(0, 10) + '</td>'));
              
                // Get group size
                $.ajax({
                  url: '/groups/' + response[i]._id.toString(),
                  dataType: "json",
                  contentType: "application/json; charset=UTF-8",
                  success: function(group) {
					  if (group.members.length+1 < response[i].size) {
						tmp.append($('<td class="slots-open col-md-3">' + (group.members.length+1) + '/' + response[i].size + '</td>'));
						parent.append(tmp);
					  }
                  }
                });
              }
            });
          }
        }
      });
    } else {
      $('.panel').html('<h2 class="course" style="margin-left: 10px;">This course is not offered</h2>');
    } 
  } else {
    $('.panel').html('<h2 class="course" style="margin-left: 10px;">Please type in the course you wish to look for</h2>');
  }
});

$('#orderModal').on('show.bs.modal', function(event) {
	var row = $(event.relatedTarget); // Row that is clicked
	var getid = $(row).data('id');
	var uid = localStorage.getItem('userID');
	
	var modal = $(this)
    // Retrieve poll info
    $.ajax({
      url: '/polls/' + getid,
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      success: function(response) {
		//console.log(response);
		var applications = response.applications;
        modal.find('.modal-title').text(response.title);
        modal.find('.group-title').text(response.title);
        modal.find('.slots').text($(row).find('.slots-open').text());
        modal.find('.host').text('Host: ' + $(row).find('.group-host').text());
        modal.find('.description').text(response.description);
        // If the creator is different from the user
        modal.find('.app-form').html('Application Form');

		var questions = response.questions;
		
		for (var i=0; i<questions.length; i++) {
		  var q = questions[i];
		  var form_div = $('<div class="form-group"></div>');
		  form_div.attr('id', q.id);
		  // Open Q
		  if (q.q_type == 0) {
		    form_div.attr('data-qtype', 0);
			form_div.append('<label for="textarea_answer">' + q.question + '</label><textarea id="textarea-' + q.id + '" class="form-control" rows="3" required></textarea>');
		  } 
		  // Single MC Q
		  else if (q.q_type == 1) {
		    form_div.attr('data-qtype', 1);
		    form_div.append('<div class="row"><label class="col-xs-12">'+ q.question +'</label></div>');
		    for (var j=0; j<q.options.length; j++) {
			  var opt = q.options[j];
		      form_div.append('<label class="radio-inline"><input type="radio" name="radio' + q.id + '" value="' + opt.value + '" required/>' + opt.value + '</label>');
		    }
		  }
		  // Multiple MC Q
		  else {
		    form_div.attr('data-qtype', 2);
		    form_div.append('<div class="row"><label class="col-xs-12">'+ q.question +'</label></div>');
		    for (var j=0; j<q.options.length; j++) {
			  var opt = q.options[j];
		      form_div.append('<label class="checkbox-inline"><input type="checkbox" name="checkbox' + q.id + '" value="' + opt.value + '"/>' + opt.value + '</label>');
		    }		    
		  }
		  modal.find('.questions').append(form_div);
		}
		
		// If user is the creator, show button that edits the polls
		if (response.creator == uid) {
		  var btn = $('<a href="managepoll?pid=' + getid + '"><button type="button" class="btn btn-success">Edit</button></a>');
          modal.find('.questions').append(btn);
		} else {
			
		  var btn;
		  if (contains_applicant(applications, uid) != -1) {
			// button that edits the responses
		    btn = $('<button type="submit" class="edit btn btn-success">Edit</button>');
		  } else {
		    // button that submits the responses
		    btn = $('<button type="submit" class="submit btn btn-success">Submit</button>');
		  }
		  modal.find('.questions').append(btn);
        }
		
		var applied = contains_applicant(applications, uid); // index in applications or -1 if not applied
		if (applied != -1) {
			
			// Waiting for the host to respond, thus can edit responses
			if (applications[applied].status == 0) {
				var answers = applications[applied].answers;
				for (var i = 0; i<answers.length; i++) {
					var qid = answers[i].question;
					var q = document.getElementById(qid);
					
					// Open Questions
					if (q.getAttribute('data-qtype') == 0) {
						modal.find('#textarea-' + qid).val(answers[i].value);
					}
					// MC Questions
					else {
						var opt = q.querySelector('label>input[value="' + answers[i].value + '"]');
						opt.checked = true;
					}
				}
			}
			// Invited
			else if (applications[applied].status == 1) {
				
				modal.find('.modal-title').text(response.title)
				modal.find('.group-title').text(response.title)
				modal.find('.slots').text($(row).find('.slots-open').text())
				modal.find('.host').text('Host: ' + $(row).find('.group-host').text())
				modal.find('.description').html(response.description)
				modal.find('.app-form').html('You are invited!')
				
				// the button must be edit button if the invitation was not received and submit button if application was not submitted
				modal.find('.questions').html('<button type="button" class="reject btn btn-danger" data-dismiss="modal">Reject</button><button type="button" class="accept btn btn-success" data-dismiss="modal">Accept</button>')
				$('.accept').on('click', function() {
					if (confirm('Will you accept the invitation to this group?')) {
						// Add the user to the group
						$.ajax({
							url: '/groups/' + getid + '/member',
							type: "POST",
							dataType: "json",
							contentType: "application/json; charset=UTF-8",
							data: JSON.stringify({
								uid: parseInt(uid)
							}),
							statusCode:{
								200: function(res){
									alert("You are now part of the group!");
									console.log("added user " + uid +" to group successfully");
									window.location.href = 'dashboard';
								},
								403: function(res){
									alert("I'm sorry, please try again");
									console.log("error in adding user to group");
								}
							}
						});
						
						// Change the status of the user's application
						$.ajax({
							url: '/applications',
							type: "PUT",
							dataType: "json",
							contentType: "application/json; charset=UTF-8",
							data: JSON.stringify({
								uid: parseInt(uid),
								pid: getid,
								status: 2
							}),
							statusCode:{
								200: function(res){
									console.log("updated user " + uid +" to group successfully");
								},
								403: function(res){
									console.log("error in updating application");
								}
							}
						});
					}
				})			
				$('.reject').on('click', function() {
					if (confirm('Are you sure? You will have to apply again in order to join this group!')) {
						// remove this item from the 'My applications' panel
						$.ajax({
							url: '/applications',
							type: "DELETE",
							dataType: "json",
							contentType: "application/json; charset=UTF-8",
							data: JSON.stringify({
								uid: parseInt(uid),
								pid: getid
							}),
							statusCode:{
								200: function(data){
									alert("good bye!");
									window.location.reload();
								},
								403: function(data) {
									alert("failed");
								}
							}
						});
					}
				})
			}
			// Invited and Accepted
			else {
				window.location.href = 'mygroups';
			}
		}
		
		// unbind the submission
		$('.questions').off('submit');
		
		// Submit/edit responses
		$('.questions').on('submit', function(e) {
			e.preventDefault();
			// Above line is to stay on the same page
			
			var btn_type = $(this).find("button").text();
			
			if (btn_type == "Submit") {
				var ans = []; //answers has [{question (id), value}]
				var q_list = modal.find('.form-group');
				for (var d = 0; d < q_list.length; d++){
					var ques = q_list[d];
					qid = ques.id;
					q_type = ques.getAttribute('data-qtype');
					
					// open answers
					if (q_type == 0){
						var text_ans = modal.find('#textarea-' + qid).val();
						var new_ans = {
							question: parseInt(qid),
							value: text_ans
						};
						//console.log(new_ans);
						ans.push(new_ans); // push answer
					}
					// MC questions
					else if (q_type == 1 || q_type == 2){
						var options = $(ques).find('label>input');
						$.each(options, function(index) {
							if ($(this).prop("checked")) {
							var value = $(this).parent().text();
							var new_ans = {
								question: parseInt(qid),
								value: value
							};
							ans.push(new_ans); // push answer
							}
						});
					}
				}
				
				// send post request
				$.ajax({
				url: '/applications',
				type: "POST",
				dataType: "json",
				contentType: "application/json; charset=UTF-8",
				data: JSON.stringify({
					uid: parseInt(uid),
					pid: getid,
					answers: ans
				}),
				statusCode:{
					200: function(res){
						alert("Your application has been submited!");
						window.location.reload();
					},
					403: function(res){
						alert("Oops! Please try submitting again!");
						window.location.reload();
					}
				}
				});
				
			} else if (btn_type == "Edit") {
				var updated_ans = []; //answers has [{question (id), value}]
				var q_list = modal.find('.form-group');
				var new_ans_added = false;
				
				var answers = applications[applied].answers;
				for (var d = 0; d < q_list.length; d++){
					var ques = q_list[d];
					qid = ques.id;
					q_type = ques.getAttribute('data-qtype');
					
					// open answers
					if (q_type == 0){
						var text_ans = modal.find('#textarea-' + qid).val();
						var new_ans = {
							question: parseInt(qid),
							value: text_ans
						};
						console.log(new_ans);
						new_ans_added |= !check_answers_in_list(new_ans, answers);
						updated_ans.push(new_ans); // push anyways
					}
					// MC questions
					else if (q_type == 1 || q_type == 2){
						var options = $(ques).find('label>input');
						$.each(options, function(index) {
							if ($(this).prop("checked")) {
							var value = $(this).parent().text();
							var new_ans = {
								question: parseInt(qid),
								value: value
							};
							new_ans_added |= !check_answers_in_list(new_ans, answers);
							updated_ans.push(new_ans); // push anyways
							}
						});
					}
				}
				if (!new_ans_added){
					alert("No change made");
				}
				else {
					// send put request to update answers
					$.ajax({
						url: '/applications',
						type: "PUT",
						dataType: "json",
						contentType: "application/json; charset=UTF-8",
						data: JSON.stringify({
							uid: parseInt(uid),
							pid: getid,
							answers: updated_ans
						}),
						statusCode:{
							200: function(res){
								alert("updated application successfully!");
							},
							403: function(res){
								alert("error in updating application");
							}
						}
					});
				}
			}
		});
      }
    });
});

// Default the application form when modal hides
$('#orderModal').on('hide.bs.modal', function(event) {
	var modal = $(this);
	modal.find('.questions').html('');
});

qNo = 0;

function createQuestion() {	
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
	
		var app_form = document.getElementById('application_form');
		app_form.insertBefore(form_div, app_form.lastElementChild);	
	}
	document.getElementById('inputQuestion').value = '';
}

// In case the modal is not subimtted but only closed
$('#createNewPoll').on('hidden.bs.modal', function() {
	// Default everything in the modal
	$('.newly_added').remove();
	document.getElementById('inputQuestion').value = '';
	$('#inputCourse').val($('.course').text());
	$('#inputProjectTitle').val('');
	$('#inputProjectDesc').val('');
	document.getElementById('question_type').value = 'text';
	qNo = 0;
});


$('#application_form').on('submit', function(e) {
  e.preventDefault();
  
  var uid = localStorage.getItem('userID');
  
  var inputProjectTitle = $('#inputProjectTitle').val();
  var inputProjectDesc = $('#inputProjectDesc').val();
  var inputCourse = $('#inputCourse').val().toUpperCase();
  
  var select_id = document.getElementById("select_id");
  var group_size = select_id.options[select_id.selectedIndex].value;
	
  var date = new Date();
  
  // Questions that are newly added"
  $('.newly_added').find('.remove-question').remove();
  var questions = $('.newly_added').clone();
  
  var q_data = [];
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
  
  // POST poll
  $.ajax({
    url: "/polls",
    type: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      "creator": parseInt(uid),
      "title": inputProjectTitle,
      "description": inputProjectDesc,
      "size": parseInt(group_size),
      "date": date,
      "course": inputCourse,
      "questions": q_data
    }),
    success: function(response) {
      // POST group
	  $.ajax({
	    url: "/groups",
	    type: "POST",
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    data: JSON.stringify({
	     "pid": response._id,
	     "creator": parseInt(uid)
	    })
	  });
	  window.location.reload();
    }
  });
});

// Check if applicant with uid is included in applications
var contains_applicant = function(applications, uid) {
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

// check if the new answers is "new"
var check_answers_in_list = function(updated_ans, original_ans){
	//console.log(updated_ans);
	for (var i = 0; i < original_ans.length; i++){
		//console.log(original_ans[i]);
		if ((updated_ans.question == original_ans[i].question)
		 && (updated_ans.value == original_ans[i].value)){
			return true;
		}
	}
	return false;
}

// Logout
$('#logout').click(function () {
  document.cookie = '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  localStorage.removeItem('userID');
});