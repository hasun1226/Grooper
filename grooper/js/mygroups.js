$( document ).ready(function() {
	var url = window.location.href;
	if (url.indexOf("#1") >= 0) {
		$('.title').text('CSC309 - TA application');
		$('.description').html('This project is intended to create an application that receives applications for TA positions.<br>I already have one person in the group so I just need 2 more members who are willing to learn and have some fun at the same time! No strings attached :)');
		$('.host').text('Host: Amir Chinaei');
		
		var items = $('<ul></ul>');
		items.append($('<li><a href="#" class="list-group-item" id="member1">Amir Chinaei</a></li>'));
		items.append($('<li><a href="#" class="list-group-item" id="member2">Nishant Arora</a></li>'));
		items.append($('<li><a href="#" class="list-group-item" id="member3">Bill Gates</a></li>'));
		$('#members').html(items);
	};
	
	$('#member1, #member2, #member3, #member4, #member5').on('click',function(){
		var name = $(this).text();
		$('#app-name').text(name);
		var name_list = name.split(" ");
		$('#app-email').text(name_list[0].toLowerCase() + "." + name_list[1].toLowerCase() + "@mail.utoronto.ca");
		$("#Application").modal("show");
	});
});

$('.search').on('click', function() {
	window.location="coursepage.html";
	return false;
});