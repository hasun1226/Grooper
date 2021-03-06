// Temporary placeholder for user id
var userID = 2;

$(document).ready(function() {

	getUserInfo(userID);

	function getUserInfo(uid) {
		$.ajax({
			type : "GET",
			url : "/users/" + uid,
			dataType : "json",
			contentType : "application/json; charset=utf-8",
			success : function (response) {
				var name = response['name'];
				var email = response['email'];
				var phone = response['phone'];
				updateUI(name, email, phone);
			}
		});
	}

	function updateUI(name, email, phone) {
		$("#name").html(name);
		$("#email").html(email);
		$("#phone").html(phone);
	}

	function saveUserInfo(type, content, uid) {
		$.ajax({
			type : "PUT",
			url : "users/" + uid,
			dataType : "json",
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify( {
				[type] : content
			}),
			success : function (response) {
			}
		})
	}

	$('.search').on('click', function () {
	window.location="coursepage.html";
	return false;
});

$('#editModal').on('hidden.bs.modal', function() {
	document.getElementById('newContent').value = '';
});

$('#editModal').on('show.bs.modal', function(event) {
	var invoker = $(event.relatedTarget); //Button that invoked the modal
    var field = invoker.parent().text();
	$(this).find('.modal-title').text('Edit ' + field);
	var input = $(this).find('.required');

	if (field == 'Email') {
		input.attr('pattern', '[a-z0-9._%+-]+@[a-z0-9.-]+([.][a-z]{2,3})$');
	}
	if (field == 'Phone number') {
		input.attr('pattern', '((\(([0-9]{3})\)([0-9]{3})(-?))|([0-9]{6})|([0-9]{3}-([0-9]{3})-))([0-9]{4})');
	}
 });

$('#manageProfile').on('submit', function(e) {
	e.preventDefault();
	$('#editModal').modal('hide');
	/* Above commands to stay on the same page */

	var type = $('#editModal').find('.modal-title').text().substring(5).toLowerCase();

	// Make sure the type is in the correct format
	if (type == 'phone number') {
		type = 'phone';
	}
	var content = $("#newContent").val();
	saveUserInfo(type, content, userID);
	$("#" + type).html(content);


	// var textInput = document.getElementById('newContent').value;
	// var field = $('#editModal').find('.modal-title').text().substring(5);
	// document.getElementById(field).textContent = textInput;

});

$('#addCourses').on('hidden.bs.modal', function() {
	document.getElementById('newCourse').value = '';
});

$('#addCourses').on('show.bs.modal', function(event) {
	 var title = $(event.relatedTarget).parent().text();
	$(this).find('.modal-title').text(title);
});

$('#manageCourse').on('submit', function(e) {
	e.preventDefault();
	$('#addCourses').modal('hide');
	/* Above commands to stay on the same page */

	var textInput = document.getElementById('newCourse').value.toUpperCase();
	var ul = document.getElementById($('#addCourses').find('.modal-title').text().substring(0, 4));
	var li = document.createElement('li')
	$(li).addClass('list-group-item');
	var span = document.createElement('span')
	$(span).addClass('remove-course btn glyphicon glyphicon-trash');
	li.innerHTML = textInput;
	span.onclick = function() {ul.removeChild(li);}
	li.appendChild(span);
	ul.appendChild(li);
});

// The below function will be unnecessary because it will be handled by the function above
// It is only here in order to delete the already-existing items
$('.remove-course').on('click', function() {
	var parent_li = $(this).parent();
	$(parent_li).remove();
});

});

