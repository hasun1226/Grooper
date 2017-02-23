$('.form-signin').on('submit', function(e) {
	e.preventDefault();
	/* Above command to stay on the same page just to see how front-end works */
	
	window.location="dashboard.html";
	return false;
});

$('.register').on('click', function () {
	window.location="register.html";
	return false;
});
