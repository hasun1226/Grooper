$(document).ready(function() {
  course = location.search.substr(8).toUpperCase();
  
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
                  tmp.append($('<td class="slots-open col-md-3">' + (group.members.length+1) + '/' + response[i].size + '</td>'));
                  parent.append(tmp);
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
});

$('#orderModal').on('show.bs.modal', function(event) {
	var row = $(event.relatedTarget) // Row that is clicked
	var getid = $(row).data('id')
	
	var modal = $(this)
	if (getid == 4) {
		modal.find('.modal-title').text('Apple Project')
		modal.find('.group-title').text('Apple Project')
		modal.find('.slots').text('1/4')
		modal.find('.host').text('Host: Steve Jobs')
		modal.find('.description').html('You know when I say "Apple"')
		modal.find('.app-form').html('Application Form')
		// Submit button should validate the required responses
		modal.find('.questions').html('<button type="submit" class="submit btn btn-success" data-dismiss="modal">Submit</button>')
		
	} else if (getid == 3) {
		modal.find('.modal-title').text('Looking for a hard worker')
		modal.find('.group-title').text('Looking for a hard worker')
		modal.find('.slots').text('1/4')
		modal.find('.host').text('Host: Bill Gates')
		modal.find('.description').html('Still thinking about the project idea')
		modal.find('.app-form').html('Application Form')
		
		var answer = ['A', 'B', 'C', 'Just wanna pass'];
		var form_div = $('<div class="form-group"></div>')
		form_div.append('<div class="row"><label class="col-xs-12">Which grade do you aim for in this course?</label></div>');
		
		for (var i = 1; i < answer.length + 1; i++) {
			form_div.append('<label class="radio-inline"><input type="radio" name="inlineRadioOptions" id="inlineRadioOptions' + i + '" value="option' + i + '"/>' + answer[i-1] + '</label>');
		}
		// Adds different Edit button because it is created by the user
		modal.find('.questions').html(form_div).append('<a href="managepoll.html"><button type="button" class="btn btn-success">Edit</button></a>')
		
	} else if (getid == 2) {
		modal.find('.modal-title').text('Social Media Application')
		modal.find('.group-title').text('Social Media Application')
		modal.find('.slots').text('1/4')
		modal.find('.host').text('Host: Mark Zuckerberg')
		modal.find('.description').html('My project idea is a social networking web application where you share your posts with your friends.<br>The key feature of the project is allowing other people to "like" your post.<br>I\'m thinking of calling this project "Facebook."<br>By completing this project, we can all use it to impress the boy/girl we like LOL')
		modal.find('.app-form').html('Application Form')
		
		// Text area
		var form_div = $('<div class="form-group"></div>');
		form_div.append('<label for="textarea_answer">Do you have a web application development experience?</label><textarea class="form-control" id="textarea_answer" rows="3" required></textarea>');
		
		// Radio buttons
		var form_div1 = $('<div class="form-group"></div>');
		form_div1.append('<div class="row"><label class="col-xs-12">How high would you rate your coding skills?</label></div>');
		for (var i = 1; i < 5 + 1; i++) {
			form_div1.append('<label class="radio-inline"><input type="radio" name="inlineRadioOptions" id="inlineRadio' + i + '" value="' + i + '" required/>' + i + '</label>');
		}
		
		// Checkboxes
		var answer = ['C', 'Java', 'MySQL', 'Python', 'XML'];
		var form_div2 = $('<div class="form-group"></div>')
		form_div2.append('<div class="row"><label class="col-xs-12">Choose all the programming languages you can use</label></div>');
		for (var i = 1; i < answer.length + 1; i++) {
			form_div2.append('<label class="checkbox-inline"><input type="checkbox" name="inlineCheckbox" id="inlineCheckbox' + i + '" value="' + i + '"/>' + answer[i-1] + '</label>');
		}
		
		// button that edits the responses, must be submit button if application was not submitted
		var btn = $('<button type="submit" class="edit btn btn-success">Edit</button>')
		
		modal.find('.questions').html(form_div).append(form_div1, form_div2, btn)
		
		// Default values
		modal.find('#textarea_answer').val(text_ans)
		modal.find('#inlineRadio' + radio_checked).prop('checked', true)
		$.each(checkbox_checked, function(index, value) {
			modal.find('#inlineCheckbox' + value).prop('checked', true)
		})
	} else if (getid > 4) {
		modal.find('.modal-title').text("We just created a new poll")
		modal.find('.group-title').text("We just created a new poll")
		modal.find('.slots').text('1/4')
		modal.find('.host').text('Host: Bill Gates')
		modal.find('.description').html('This is to show you how a new poll is created. The page should be refreshed once a new poll is created, and the data that is added to the database will be fetched to show the contents of this modal.')
		modal.find('.app-form').html('You made it! The questions you made are as follow.')
		var form_div = $('<div class="form-group"></div>');
		questions_added.each(function() {
			form_div.append($(this))
		})
		modal.find('.questions').html(form_div)
		
	} else {
		modal.find('.modal-title').text('TA Application')
		modal.find('.group-title').text('TA Application')
		modal.find('.slots').text('2/4')
		modal.find('.host').text('Host: Amir Chinaei')
		modal.find('.description').html('This project is intended to create an application that receives applications for TA positions.<br>I already have one person in the group so I just need 2 more members who are willing to learn and have some fun at the same time! No strings attached :)')
		modal.find('.app-form').html('You are invited!')
		
		// the button must be edit button if the invitation was not received and submit button if application was not submitted
		modal.find('.questions').html('<button type="button" class="reject btn btn-danger" data-dismiss="modal">Reject</button><button type="button" class="accept btn btn-success" data-dismiss="modal">Accept</button>')
		$('.accept').on('click', function() {
			if (confirm('Will you accept the invitation to this group?')) {
				// move to 'My groups'? or leave it in the 'My applications' panel?
			}
		})
		
		$('.reject').on('click', function() {
			if (confirm('Are you sure? You can\'t join this group again if you reject now!')) {
				// remove this item from the 'My applications' panel
			}
		})
	}
});

// Submit/edit responses
$('.questions').on('submit', function(e) {
	e.preventDefault();
	// Above line is to stay on the same page
	
	text_ans = modal.find('#textarea_answer').val();
	radio_checked = $('input[name=inlineRadioOptions]:checked').val();
	checkbox_checked = [];
	$('input[name=inlineCheckbox]:checked').each(function () {
		checkbox_checked.push($(this).val());
	});
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
	  var q_id = this.id;
	  var question = $(this).find('.col-xs-12').text();
	  var rad_opt = $(this).find(".radio-inline");
	  var cb_opt = $(this).find(".checkbox-inline");
	  if ($(this).find("textarea").length > 0){
		  q_data.push("{id:" + q_id + ", q_type:" + 0 + ", question:" + question  + "}");
	  } else if (rad_opt.length > 0) {
		  var options = [];
		  rad_opt.each(function() {
			options.push("{value:" + $(this).text().trim('') + ", correct:" + $(this).children(":first").prop("checked") + "}"); 
		  });
		  q_data.push("{id:" + q_id + ", q_type:" + 1 + ", question:" + question  + ", options:[" + options + "]}");
	  } else if(cb_opt.length > 0) {
		  var options = [];
		  cb_opt.each(function() {
			options.push("{value:" + $(this).text().trim('') + ", correct:" + $(this).children(":first").prop("checked") + "}"); 
		  });
		  q_data.push("{id:" + q_id + ", q_type:" + 2 + ", question:" + question  + ", options:[" + options + "]}");
	  }
    
  });
  
  // POST poll
  $.ajax({
    url: "/polls",
    type: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      "creator": 2,  // Need to change the creator with the uid
      "title": inputProjectTitle,
      "description": inputProjectDesc,
      "size": group_size,
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
	     "creator": 2  // Need to change the creator with the uid
	    })
	  });
    }
  });
  window.location.reload();
});