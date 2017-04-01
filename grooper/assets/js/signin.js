$('.form-signin').on('submit', function(e) {
  e.preventDefault();
  var email = $("#inputEmail").val();
  var pw = $("#inputPassword").val();
	
  $.ajax({
    url: "/login",
    type: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({ "email": email, "pw": pw }),
    success: function(data) {
      // Logged on the browser console
      console.log(JSON.stringify(data));
      window.location="dashboard?uid=" + data.userID + "&key=" + data.token;
    },
    error: function (jqXHR, exception) {
      if (jqXHR.status === 403)
        alert("Your email or password is invalid");
    }
  });
});

$('.register').on('click', function () {
  window.location="register";
});
