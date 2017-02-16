$('#member1, #member2, #member3').on('click',function(){
	var name = $(this).text()
	$('#app-name').text(name);
	$('#app-email').text(name + "@mail.utoronto.ca")
    $("#Application").modal("show");
});