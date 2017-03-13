$('.form-register').on('submit', function(e) {
	e.preventDefault();
	
	if ($('#registerPassword').val() == $('#confirmPassword').val()) {
		
		var formData = {
		  "name": $("#registerName").val(),
		  "email": $("#registerEmail").val(),
		  "phone": $("#registerPhone").val(),
		  "pw": $("#registerPassword").val()
		}
		
		$.ajax({
            url: "/users",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(formData),
			success: function(data) {
				// Logged on the browser console
				console.log(JSON.stringify(data));
				alert("Successfully registered!");
				window.location="/";
			}
		});
	} else {
		alert('Your passwords don\'t match!');
	}
});

$('.back_btn').on('click', function () {
	window.location="/";
});
