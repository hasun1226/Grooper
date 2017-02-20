$(document).ready(function() {
	document.getElementById('InputName').value = 'Bill Gates'
	document.getElementById('InputEmail').value = 'bill@microsoft.com'
	
	if (document.getElementById('textarea_answer')) {
		document.getElementById('textarea_answer').defaultValue = 'bunch'
	}
	
	if (document.getElementById('inlineRadio5')) {
		document.getElementById('inlineRadio5').checked = true
	}
	
	if (document.getElementById('inlineCheckbox1')) {
		for(var i = 1; i < 5 + 1; i++) {
			document.getElementById('inlineCheckbox' + i).checked = true
		}
	}
});

$('.search').on('click', function() {
	window.location="coursepage.html";
	return false;
});

$('#orderModal').on('show.bs.modal', function(event) {
	var row = $(event.relatedTarget) // Row that is clicked
	var getid = $(row).data('id')
	
	var modal = $(this)
	if (getid == 2) {
		modal.find('.modal-title').text('Social Media Application')
		modal.find('.group-title').text('Social Media Application')
		modal.find('.slots').text('1/4')
		modal.find('.host').text('Host: Mark Zuckerberg')
		modal.find('.description').html('My project idea is a social networking web application where you share your posts with your friends.<br>The key feature of the project is allowing other people to "like" your post.<br>I\'m thinking of calling this project "Facebook."<br>By completing this project, we can all use it to impress the boy/girl we like LOL')
	} else {
		modal.find('.modal-title').text('TA Application')
		modal.find('.group-title').text('TA Application')
		modal.find('.slots').text('2/4')
		modal.find('.host').text('Host: Amir Chinaei')
		modal.find('.description').html('This project is intended to create an application that receives applications for TA positions.<br>I already have one person in the group so I just need 2 more members who are willing to learn and have some fun at the same time! No strings attached :)')
		modal.find('.questions').html('<button type="button" class="edit btn btn-success" data-dismiss="modal">Edit</button>')
	}
	
});

$('.edit').on('click', function() {
	var name = document.getElementById('InputName').value
	document.getElementById('InputName').value = name
	var email = document.getElementById('InputEmail').value
	document.getElementById('InputEmail').value = email
	if (document.getElementById('textarea_answer')) {
		var text_ans = document.getElementById('textarea_answer').value
		document.getElementById('textarea_answer').defaultValue = text_ans
	}
	
	if (document.getElementsByName('inlineRadioOptions')) {
		var radios = document.getElementsByName('inlineRadioOptions')
		for (var i = 1; i < radios.length + 1; i++) {
			if (radios[i-1].checked) {
				document.getElementById('inlineRadio' + i).checked = true
			}
		}
	}
	
	if (document.getElementsByName('inlineCheckbox')) {
		var checks = document.getElementsByName('inlineCheckbox')
		for(var i = 1; i < checks.length + 1; i++) {
			if (checks[i-1].checked) {
				document.getElementById('inlineCheckbox' + i).checked = true
			}
		}
	}
});