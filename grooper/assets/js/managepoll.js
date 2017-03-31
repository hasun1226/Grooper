$(document).ready(function() {
	var pid = location.search.substr(5);
	$.ajax({
      url: '/polls/' + pid,
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      success: function(response) {
		document.getElementById('inputProjectTitle').value = response.title;
		document.getElementById('inputProjectDesc').defaultValue = response.description;
		document.getElementById('groupSize').value = response.size;
		
		// Get creator's name
          $.ajax({
            url: '/users/' + response.creator.toString(),
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            success: function(creator) {
				document.getElementById('host').innerHTML = "Host: " + creator.name;
			}
		  });
		
	  }
	})
	
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