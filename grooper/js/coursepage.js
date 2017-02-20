$('#orderModal').on('show.bs.modal', function(event) {
	var row = $(event.relatedTarget) // Row that is clicked
	var getid = $(row).data('id')
	
	var modal = $(this)
	if (getid == 3) {
		modal.find('.modal-title').text('Looking for a hard worker')
		modal.find('.group-title').text('Looking for a hard worker')
		modal.find('.slots').text('1/4')
		modal.find('.host').text('Host: Bill Gates')
		modal.find('.description').html('Still thinking about the project idea')
		
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
		
		var form_div = $('<div class="form-group"></div>');
		form_div.append('<label for="textarea_answer">Do you have a web application development experience?</label><textarea class="form-control" id="textarea_answer" rows="3"></textarea>');
		
		var form_div1 = $('<div class="form-group"></div>');
		form_div1.append('<div class="row"><label class="col-xs-12">How high would you rate your coding skills?</label></div>');
		for (var i = 1; i < 5 + 1; i++) {
			form_div1.append('<label class="radio-inline"><input type="radio" name="inlineRadioOptions" id="inlineRadio' + i + '" value="option' + i + '"/>' + i + '</label>');
		}
		
		var answer = ['C', 'Java', 'MySQL', 'Python', 'XML'];
		var form_div2 = $('<div class="form-group"></div>')
		form_div2.append('<div class="row"><label class="col-xs-12">Choose all the programming languages you can use</label></div>');
		for (var i = 1; i < answer.length + 1; i++) {
			form_div2.append('<label class="checkbox-inline"><input type="checkbox" id="inlineCheckbox' + i + '" value="option' + i + '"/>' + answer[i-1] + '</label>');
		}
		
		modal.find('.questions').append(form_div, form_div1, form_div2, '<button type="button" class="btn btn-success">Submit</button>')
		
	} else {
		modal.find('.modal-title').text('TA Application')
		modal.find('.group-title').text('TA Application')
		modal.find('.slots').text('2/4')
		modal.find('.host').text('Host: Amir Chinaei')
		modal.find('.description').html('This project is intended to create an application that receives applications for TA positions.<br>I already have one person in the group so I just need 2 more members who are willing to learn and have some fun at the same time! No strings attached :)')
		modal.find('.questions').html('<button type="button" class="btn btn-success">Submit</button>')
	}
	
});

$('.search').on('click', function() {
	window.location="coursepage.html"
	return false
});

var inputCourse
var inputProjectTitle
var inputProjectDesc
var groupSize

$('#createNewPoll').on('click', '.submit_btn', function() {
	inputCourse = $('#inputCourse').val()
	inputProjectTitle = $('#inputProjectTitle').val()
	inputProjectDesc = $('#inputProjectDesc').val()
	
	$('select').change(function(){
        groupSize = $('select option:selected').text();
    });
	
	alert(inputProjectTitle + inputProjectDesc + groupSize)
});