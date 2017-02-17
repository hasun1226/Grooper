$('#member1, #member2, #member3, #member4, #member5').on('click',function(){
	var name = $(this).text()
	$('#app-name').text(name);
	$('#app-email').text(name + "@mail.utoronto.ca")
    $("#Application").modal("show");
});

$('.search').on('click', function() {
	window.location="coursepage.html";
	return false;
});