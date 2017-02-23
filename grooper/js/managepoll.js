$(document).ready(function() {
	document.getElementById('inputProjectTitle').value = 'Looking for a hard worker';
	document.getElementById('groupSize').value = 4;
	document.getElementById('inputProjectDesc').defaultValue = 'Still thinking about the project idea';
});

$('.applicant').on('click',function(){
	var name = $(this).text();
	$('.modal-title').text(name);
	
	var questions = document.getElementsByClassName('question');
    for(var i = 0, length = questions.length; i < length; i++) {
       $('.que').text(questions[i].textContent)
	}
	$('.ans').text('A');
	// applicant's number = $(this).data('app');
    $('#Responses').modal('show');
})
  .mouseleave(function() {
  // Get rid of the effect after clicking the anchor
	  $(this).css('box-shadow', 'none')
	  $(this).css('text-decoration', 'none')
	  $(this).css('color', '#555555')
	  $(this).css('border', '1px solid #ccc')
});

$('.search').on('click', function() {
	window.location="coursepage.html";
	return false;
});

$('.edit').on('click', function() {
	var title = document.getElementById('inputProjectTitle').value;
	var slots = document.getElementById('groupSize').value;
	var desc = document.getElementById('inputProjectDesc').value;
	
	// Set the new values to be the default values
	document.getElementById('inputProjectTitle').value = title;
	document.getElementById('groupSize').value = slots;
	document.getElementById('inputProjectDesc').defaultValue = desc;
});

/*
 * Need to decide how to handle the applicants' responses according to this function
 * Will be similar to the Question adding function in coursepage.html
 */
$('.add').on('click', function() {
	
});

$('.invite').on('click', function() {
	var applicant = $(this).parent().prev('.applicant').text();
	if (confirm('Do you want to invite ' + applicant + ' to your group?')) {
		// Send invitation to the applicant!
	}
});