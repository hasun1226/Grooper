$('.form-register').on('submit', function(e) {
	e.preventDefault();
	/* Above command to stay on the same page just to see how front-end works */
	
	if ($('#registerPassword').val() == $('#confirmPassword').val()) {
		alert('You are registered!');
		window.location="signin.html";
	} else {
		alert('Your passwords don\'t match!');
	}
	return false;
});

$('.back_btn').on('click', function () {
	window.location="signin.html";
	return false;
});
