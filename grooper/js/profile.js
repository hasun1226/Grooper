$('.search').on('click', function () {
	window.location="coursepage.html";
	return false;
});

$('#editModal').on('show.bs.modal', function(event) {
  var $invoker = $(event.relatedTarget); //Button that invoked the modal

  $(this).find('.modal-title').text('Edit ' + $invoker.parent().text());
});
