var text_ans = 'bunch'
var radio_checked = 5
var checkbox_checked = [1,2,3,4,5]

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
		modal.find('.questions').html(form_div).append('<a href="managepoll.html" class="btn btn-success">Edit</a>')
		
	} else if (getid == 2) {
		modal.find('.modal-title').text('Social Media Application')
		modal.find('.group-title').text('Social Media Application')
		modal.find('.slots').text('1/4')
		modal.find('.host').text('Host: Mark Zuckerberg')
		modal.find('.description').html('My project idea is a social networking web application where you share your posts with your friends.<br>The key feature of the project is allowing other people to "like" your post.<br>I\'m thinking of calling this project "Facebook."<br>By completing this project, we can all use it to impress the boy/girl we like LOL')
		modal.find('.app-form').html('Application Form')
		
		// Text area
		var form_div = $('<div class="form-group"></div>');
		form_div.append('<label for="textarea_answer">Do you have a web application development experience?</label><textarea class="form-control" id="textarea_answer" rows="3"></textarea>');
		
		// Radio buttons
		var form_div1 = $('<div class="form-group"></div>');
		form_div1.append('<div class="row"><label class="col-xs-12">How high would you rate your coding skills?</label></div>');
		for (var i = 1; i < 5 + 1; i++) {
			form_div1.append('<label class="radio-inline"><input type="radio" name="inlineRadioOptions" id="inlineRadio' + i + '" value="' + i + '"/>' + i + '</label>');
		}
		
		// Checkboxes
		var answer = ['C', 'Java', 'MySQL', 'Python', 'XML'];
		var form_div2 = $('<div class="form-group"></div>')
		form_div2.append('<div class="row"><label class="col-xs-12">Choose all the programming languages you can use</label></div>');
		for (var i = 1; i < answer.length + 1; i++) {
			form_div2.append('<label class="checkbox-inline"><input type="checkbox" name="inlineCheckbox" id="inlineCheckbox' + i + '" value="' + i + '"/>' + answer[i-1] + '</label>');
		}
		
		// button that edits the responses, must be submit button if application was not submitted
		var btn = $('<button type="button" class="edit btn btn-success" data-dismiss="modal">Edit</button>')
		btn.click(function () {
			text_ans = modal.find('#textarea_answer').val()
			radio_checked = $('input[name=inlineRadioOptions]:checked').val()
			checkbox_checked = []
			$('input[name=inlineCheckbox]:checked').each(function () {
				checkbox_checked.push($(this).val());
			})
		})
		
		modal.find('.questions').html(form_div).append(form_div1, form_div2, btn)
		
		// Default values
		modal.find('#textarea_answer').val(text_ans)
		modal.find('#inlineRadio' + radio_checked).prop('checked', true)
		$.each(checkbox_checked, function(index, value) {
			modal.find('#inlineCheckbox' + value).prop('checked', true)
		})
		
	} else {
		modal.find('.modal-title').text('TA Application')
		modal.find('.group-title').text('TA Application')
		modal.find('.slots').text('2/4')
		modal.find('.host').text('Host: Amir Chinaei')
		modal.find('.description').html('This project is intended to create an application that receives applications for TA positions.<br>I already have one person in the group so I just need 2 more members who are willing to learn and have some fun at the same time! No strings attached :)')
		modal.find('.app-form').html('You are invited!')
		
		// the button must be edit button if the invitation was not received and submit button if application was not submitted
		modal.find('.questions').html('<button type="button" class="accept btn btn-success" data-dismiss="modal">Accept</button><button type="button" class="reject btn btn-danger" data-dismiss="modal">Reject</button>')
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

$('.search').on('click', function() {
	window.location="coursepage.html"
	return false
});

qNo = 1;

function createQuestion() {
	var question = document.createElement("INPUT");
    question.id = "text" + qNo;
    question.type = "text"; // Change
	question.className = "form-control";
	
	var label = document.createElement("label");
	label.labelfor = "sth";
	label.innerHTML = document.getElementById('inputQuestion').value;
	
	var form_div = document.createElement('div');
	form_div.className ='form-group newly_added';
	
	form_div.append(label, question);
	
	var app_form = document.getElementById('application_form');
	app_form.insertBefore(form_div, app_form.lastElementChild);
	
	document.getElementById('inputQuestion').value = '';
}

$('#createNewPoll').on('hidden.bs.modal', function() {
	// Default everything in the modal
	$('.newly_added').remove();
	document.getElementById('inputQuestion').value = '';
	$('#inputCourse').val('CSC309');
	$('#inputProjectTitle').val('');
	$('#inputProjectDesc').val('');
});

$('#application_form').on('submit', function(e) {
	e.preventDefault();
	/* Above command to stay on the same page */
	
	var inputCourse = $('#inputCourse').val();
	var inputProjectTitle = $('#inputProjectTitle').val();
	var inputProjectDesc = $('#inputProjectDesc').val();

	var select_id = document.getElementById("select_id");
	var group_size = select_id.options[select_id.selectedIndex].value;
	
	$('#createNewPoll').modal('hide');
	// Default everything in the modal
	$('#inputCourse').val('CSC309');
	$('#inputProjectTitle').val('');
	$('#inputProjectDesc').val('');
	qNo = 1
});