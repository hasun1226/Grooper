$(document).ready(function() {
	var pid = location.search.substr(5);
	
	qNo = 0;
	  
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
		  var form_div = $('<div class="form-group"></div>');
		  if (q.q_type == 0) {
		    form_div.append('<label for="textarea_answer">'+ q.question +'</label><textarea class="form-control" id='+ q.id +' rows="3" required></textarea>');
		  } else if (q.q_type == 1) {
		    form_div.append('<div class="row"><label class="col-xs-12">'+ q.question +'</label></div>');
		    for (var j=0; j<q.options.length; j++) {
			  var opt = q.options[j];
		      form_div.append('<label class="radio-inline"><input type="radio" name="radio' + q.id + '" value="' + opt.value + '" required/>' + opt.value + '</label>');
		    }
		  } else {
		    form_div.append('<div class="row"><label class="col-xs-12">'+ q.question +'</label></div>');
		    for (var j=0; j<q.options.length; j++) {
			  var opt = q.options[j];
		      form_div.append('<label class="checkbox-inline"><input type="checkbox" name="checkbox' + q.id + '" value="' + opt.value + '" required/>' + opt.value + '</label>');
		    }		    
		  }
		  qs.append(form_div);
		  qNo++;
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
		
	  }
	})
	


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
			"questions": []
		}), success: function(response) {
		    window.location.reload();	
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
	
		$('.questions').append(form_div);
	}
	document.getElementById('inputQuestion').value = '';
  });

  $('.invite').on('click', function() {
	var applicant = $(this).parent().prev('.applicant').text();
	if (confirm('Do you want to invite ' + applicant + ' to your group?')) {
      // Send invitation to the applicant!
  	}
  });
});