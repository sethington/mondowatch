// when dom is ready, populate with our settings
document.addEventListener('DOMContentLoaded', function () {
  $("#notificationFreq").val(localStorage.frequency);

  $("#saveOptions").click(function(){
  	localStorage.frequency = $("#notificationFreq").val();
  	console.log("Options updated", localStorage.frequency);
  });
});


