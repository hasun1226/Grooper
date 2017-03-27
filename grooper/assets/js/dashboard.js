$(document).ready(function() {
	var url = window.location.href;
	var uid = parseInt(url.substr(url.indexOf("=") + 1));

	get_polls(uid);

	get_groups(uid);

	get_applications(uid);
});

$('#poll').click(get_polls);

var get_polls = function(uid){

	$.ajax({
        url: '/polls?uid=' + uid,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        success: function(data){
        	if (!data.length){
        		var wrapper = document.getElementById("poll-wrapper");
        		var no_poll = document.createElement('li');
        		var message = document.createElement('p');
        		message.style.background = '#eee'
        		message.className = 'list-group-item';
        		message.innerHTML = "No polls created by you so far!";
        		no_poll.appendChild(message);
        		wrapper.appendChild(no_poll);
        	}
        	else{
        		for (var i = 0; i < data.length; i++){
            		add_poll_to_page(data[i]);
            	}
        	}
        },
        statusCode:{
        	403: function(res){
				alert("No user!");
			}
        }
	});
}


var add_poll_to_page = function(poll){

	var closed = false

	// get the group based on pid then check if group is full
	$.ajax({
        url: '/groups/' + poll._id,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        success: function(data){
        	console.log(data.members.length);
        	closed = ((data.members.length + 1) === poll.size); // +1 b/c of owner

        	var wrapper = document.getElementById("poll-wrapper");
    		var li = document.createElement('li');
    		var a = document.createElement('a');
    		a.className = 'list-group-item';
    		a.innerHTML = poll.title;
    		var span = document.createElement('span');
    		span.className = "badge";
    		if (closed){
    			a.href = "mygroups.html";
    			span.innerHTML = closed;
    		}
    		else{
    			a.href = "managepoll.html";
    			span.innerHTML = "New !";
    			span.className = "badge badge-new"
    		}
    		a.appendChild(span);
    		li.appendChild(a);
    		wrapper.appendChild(li);
        },
        statusCode:{
        	400: function(data){
        		alert("Poll " + poll._id + " has no group!");
        	}
        }
	});
}


var get_groups = function(uid){

	$.ajax({
        url: '/groups?uid=' + uid,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        success: function(data){
        	console.log(data);
        	if (!data.groups.length){
        		var wrapper = document.getElementById("group-wrapper");
        		var li = document.createElement('li');
        		var p = document.createElement('p');
        		p.style.background = '#eee'
        		p.className = 'list-group-item';
        		p.innerHTML = "You don't have any groups so far!";
        		li.appendChild(p);
        		wrapper.appendChild(li);
        	}
        	else{
        		for (var i = 0; i < data.groups.length; i++){
            		add_groups_to_page(data.groups[i]); // data[i] are pid's
            	}
        	}
        },
        statusCode:{
        	403: function(res){
				alert("No user!");
			}
        }
	});
}

var add_groups_to_page = function(pid){

	$.ajax({
        url: '/polls/' + pid,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        success: function(poll){
        	// data should contain the poll and all the related applications
        	var wrapper = document.getElementById("group-wrapper");
    		var li = document.createElement('li');
    		var a = document.createElement('a');
    		a.className = 'list-group-item';
    		a.innerHTML = poll.course + '-' + poll.title;
    		a.href = "mygroups.html";
    		li.appendChild(a);
    		wrapper.appendChild(li);
        },
        statusCode:{
        	403: function(res){
				alert("No poll!");
			}
        }
	});
}

var get_applications = function(uid){

	$.ajax({
        url: '/applications/' + uid,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        success: function(data){
        	if (!data.length){
        		var wrapper = document.getElementById("application-wrapper");
        		var li = document.createElement('li');
        		var p = document.createElement('p');
        		p.style.background = '#eee'
        		p.className = 'list-group-item';
        		p.innerHTML = "You don't have any application so far!";
        		li.appendChild(p);
        		wrapper.appendChild(li);
        	}
        	else{
        		for (var i = 0; i < data.length; i++){
            		add_applications_to_page(data[i]); // data[i] are pid's
            	}
        	}
        },
        statusCode:{
        	403: function(res){
				alert("No user!");
			}
        }
	});
}

var add_applications_to_page = function(app){
	// application has field: uid, pid, status, date, answers:{question, value}
	
	// get the poll first
	$.ajax({
        url: '/polls/' + app.pid,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        success: function(poll){
        	add_application_to_page(poll, app.status, app.uid);
        },
        statusCode:{
        	403: function(res){
				alert("No such poll!!");
			}
        }
	});
}

var add_application_to_page = function(poll, status, uid){

	var wrapper = document.getElementById("application-wrapper");
	var li = document.createElement('li');
	var a = document.createElement('a');
	a.className = 'list-group-item';
	a.href="#";
	a.innerHTML = poll.course + '-' + poll.title;
	a.setAttribute("data-status", status);
	a.setAttribute("data-uid", uid);

	// 3 cases depending on status

	// closed -> next click = delete
	// TODO check if it works if you are the last person added to the group
	if (status === 3){
		var span = document.createElement('span');
		span.className = "badge";
		span.innerHTML = "Closed";
		a.setAttribute("onclick", "this.parentNode.parentNode.removeChild(this.parentNode)");
		a.appendChild(span);
		li.appendChild(a);
		wrapper.appendChild(li);
	}
	// invited -> accept/deny
	else if (status === 1){
		// set data-id to pid
		a.setAttribute('data-pid', poll._id);
		a.setAttribute('data-toggle', "modal");
		a.setAttribute('data-target', "#orderModal");

		var span = document.createElement('span');
		span.className = "badge badge-success";
		span.innerHTML = "Invited";
		a.appendChild(span);
		li.appendChild(a);
		wrapper.appendChild(li);
	}
	// waiting -> can edit response
	else if (status === 0){
		// set data-id to pid
		a.setAttribute('data-pid', poll._id);
		a.setAttribute('data-toggle', "modal");
		a.setAttribute('data-target', "#orderModal");
		li.appendChild(a);
		wrapper.appendChild(li);
	}
	else {
		console.log("Poll " + poll._id + " already accepted you!");
	}
}

$('#orderModal').on('show.bs.modal', function(event) {
	
	var row = $(event.relatedTarget); // Row that is clicked
	var pid = $(row).data('pid');
	var uid = $(row).data('uid');
	var modal = $(this)

	// first get poll and all of its applications
	$.ajax({
        url: '/polls/' + pid,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        success: function(poll){
        	console.log("pid " + pid);
        	// then get the group
        	$.ajax({
		        url: '/groups/' + pid,
		        type: "GET",
		        dataType: "json",
		        contentType: "application/json; charset=UTF-8",
		        success: function(group){
		        	console.log("creator " + poll.creator);
		        	// then get the creator's username
		        	$.ajax({
				        url: '/users/' + poll.creator,
				        type: "GET",
				        dataType: "json",
				        contentType: "application/json; charset=UTF-8",
				        success: function(user){
				        	add_modal_to_page(modal, poll, group, user.name, uid);
				        },
				        statusCode:{
				        	403: function(res){
								alert("No such user!!");
							}
				        }
					});


		        },
		        statusCode:{
		        	403: function(res){
						alert("No such group!!");
					}
		        }
			});
        	
        },
        statusCode:{
        	403: function(res){
				alert("No such poll!!");
			}
        }
	});
});

var add_modal_to_page = function(modal, poll, group, username, uid){
	// first find the applications corresponding to the uid
	var app = {}
	for (var k = 0; k < poll.applications.length; k++){
		if (poll.applications[k].uid == uid){
			app = poll.applications[k];
			break;
		}
	}
	if (!app){
		alert("This user did not submit an application to poll " + poll._id);
	}

	modal.find('.modal-title').text(poll.title);
	modal.find('.group-title').text(poll.title);
	modal.find('.slots').text((group.members.length + 1) + '/' + poll.size);
	modal.find('.host').text('Creator: '+ username);
	modal.find('.description').html(poll.description);

	var status = app.status;
	// status is waiting
	if (status == 0) {
		modal.find('.app-form').html('Application Form');
		
		// TODO check what if they didn't answer all the question/ no. of question doesnt match with no. of answers
		for (var i = 0; i < poll.questions.length; i++){
			var question = poll.questions[i];
			var answer = {};
			for (var j = 0; j < app.answers.length; j++){
				if (question.id == app.answers[j].question){
					answer = app.answers[j];
				}
			}

			// open question
			if (question.q_type == 0){
				var div = document.createElement('div');
				div.className = "form-group";
				var label = document.createElement('label');
				label.setAttribute('for', "textarea-" + question.id);
				label.innerHTML = question.question;
				var textarea = document.createElement('textarea');
				textarea.className = "form-control";
				textarea.id = "textarea-" + question.id;
				textarea.setAttribute('rows', 3);
				if (!answer){
					textarea.value = "No answer so far!";
				}
				else {
					textarea.value = answer.value;
				}
				div.appendChild(label);
				div.appendChild(textarea);

				document.getElementById("questions-wrapper").appendChild(div);
			}
			// single-answer MC
			else if (question.q_type == 1){
				var div = document.createElement('div');
				div.className = "form-group";
				var div2 = document.createElement('div');
				div2.className = "row";
				var label = document.createElement('label');
				label.className = "col-xs-12";
				label.innerHTML = question.question;
				div2.appendChild(label);
				div.appendChild(div2);
				for (var q = 0; q < question.options.length; q++){
					var label_op = document.createElement('label');
					label_op.className = "radio-inline";
					var input = document.createElement('input');
					input.type = "radio";
					input.name = "inlineRadioOptions";
					input.id = "inlineRadio" + q;
					if (answer && question.options[q].value == answer.value){
						input.checked = true;
					}
					label_op.appendChild(input);
					var p = document.createElement('p');
					p.innerHTML = question.options[q].value;
					label_op.appendChild(p);
					div.appendChild(label_op);
				}
				document.getElementById("questions-wrapper").appendChild(div);
			}
			// multiple answer MC
			else if (question.q_type == 2){
				var div = document.createElement('div');
				div.className = "form-group";
				var div2 = document.createElement('div');
				div2.className = "row";
				var label = document.createElement('label');
				label.className = "col-xs-12";
				label.innerHTML = question.question;
				div2.appendChild(label);
				div.appendChild(div2);
				for (var q = 0; q < question.options.length; q++){
					var label_op = document.createElement('label');
					label_op.className = "checkbox-inline";
					var input = document.createElement('input');
					input.type = "checkbox";
					input.name = "inlineCheckbox";
					input.id = "inlineCheckbox" + q;
					// TODO not too sure how to do this yet
					if (answer && question.options[q].value == answer.value){
						input.checked = true;
					}
					label_op.appendChild(input);
					var p = document.createElement('p');
					p.innerHTML = question.options[q].value;
					label_op.appendChild(p);
					div.appendChild(label_op);
				}
				document.getElementById("questions-wrapper").appendChild(div);
			}
		}
		
		// button that edits the responses
		// TODO send PUT request
		var btn = $('<button type="button" class="edit btn btn-success" data-dismiss="modal">Edit</button>')
		btn.click(function () {
			// text_ans = modal.find('#textarea_answer').val()
			// radio_checked = $('input[name=inlineRadioOptions]:checked').val()
			// checkbox_checked = []
			// $('input[name=inlineCheckbox]:checked').each(function () {
			// 	checkbox_checked.push($(this).val());
			// })
		})
		
		modal.find('#questions-wrapper').append(btn);
		
		// // Default values
		// modal.find('#textarea_answer').val(text_ans)
		// modal.find('#inlineRadio' + radio_checked).prop('checked', true)
		// $.each(checkbox_checked, function(index, value) {
		// 	modal.find('#inlineCheckbox' + value).prop('checked', true)
		// })
		
	} 
	// status is invited
	else if (status == 1) {
		modal.find('.app-form').html('You are invited!');
		
		// the button must be edit button if the invitation was not received
		modal.find('.questions').html('<button type="button" class="accept btn btn-success" data-dismiss="modal">Accept</button><button type="button" class="reject btn btn-danger" data-dismiss="modal">Reject</button>')
		$('.accept').on('click', function() {
			if (confirm('Will you accept the invitation to this group?')) {
				// remove from applications and move to 'My groups' panel
				$('[data-pid="' + poll._id + '"]').remove();
				var wrapper = document.getElementById("group-wrapper");
	    		var li = document.createElement('li');
	    		var a = document.createElement('a');
	    		a.className = 'list-group-item';
	    		a.innerHTML = poll.course + '-' + poll.title;
	    		a.href = "mygroups.html";
	    		li.appendChild(a);
	    		if (wrapper.firstChild){
	    			wrapper.insertBefore(li, wrapper.firstChild);
	    		}
	    		else{
	    			wrapper.appendChild(li);
	    		}
	    		
	    		// add memeber to group
	    		$.ajax({
			        url: '/groups/' + poll._id + "/member",
			        type: "POST",
			        dataType: "json",
			        contentType: "application/json; charset=UTF-8",
			        data: JSON.stringify({
			        	uid: uid
			        }),
			        statusCode:{
			        	200: function(res){
			        		console.log("added user " + uid +" to group successfully");
			        	},
			        	403: function(res){
							console.log("error in adding user to group");
						}
			        }
				});

	    		// change status to accepted
	    		$.ajax({
			        url: '/applications',
			        type: "PUT",
			        dataType: "json",
			        contentType: "application/json; charset=UTF-8",
			        data: JSON.stringify({
			        	uid: uid,
			        	pid: poll._id,
			        	status: 2
			        }),
			        statusCode:{
			        	200: function(res){
			        		console.log("updated status of application");
			        	},
			        	403: function(res){
							console.log("error in updating status of applicaiton");
						}
			        }
				});
			}
		})
		
		$('.reject').on('click', function() {
			if (confirm('Are you sure? You can\'t join this group again if you reject now!')) {
				// remove this item from the 'My applications' panel
				$('[data-pid="' + poll._id + '"]').remove();

				// delete application
				$.ajax({
			        url: '/applications',
			        type: "DELETE",
			        dataType: "json",
			        contentType: "application/json; charset=UTF-8",
			        data: JSON.stringify({
			        	uid: uid,
			        	pid: poll._id
			        }),
			        statusCode:{
			        	200: function(res){
			        		console.log("deleted application successfully");
			        	},
			        	403: function(res){
							console.log("error in deleting application");
						}
			        }
				});
			}
		})
	}
	
}