$(document).ready(function () {
  $(".ai-call").on("submit", function (event) {
    event.preventDefault();
    console.log("Waiting period!!");
    $("#overlay").show();
    $("body").children().not("#overlay").addClass("blurred");
    this.submit(); 
  });
});
