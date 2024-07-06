document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {

    event.preventDefault();


    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("passwordError").textContent = "";
    document.getElementById("confirmPasswordError").textContent = "";
    document.getElementById("occupationError").textContent = "";


    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value.trim();
    var confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();
    var occupation = document.getElementById("occupation").value.trim();

    var isValid = true;


    if (name === "") {
      document.getElementById("nameError").textContent = "Name is required.";
      isValid = false;
    }


    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      document.getElementById("emailError").textContent =
        "Please enter a valid email address.";
      isValid = false;
    }


    if (password === "") {
      document.getElementById("passwordError").textContent =
        "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      document.getElementById("passwordError").textContent =
        "Password must be at least 6 characters long.";
      isValid = false;
    }


    if (confirmPassword === "") {
      document.getElementById("confirmPasswordError").textContent =
        "Please confirm your password.";
      isValid = false;
    } else if (password !== confirmPassword) {
      document.getElementById("confirmPasswordError").textContent =
        "Passwords do not match.";
      isValid = false;
    }


    if (occupation === "") {
      document.getElementById("occupationError").textContent =
        "Occupation is required.";
      isValid = false;
    }

    if (isValid) {
      this.submit();
    }
  });


  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      // Prevent form submission
      event.preventDefault();

      // Clear previous error messages
      document.getElementById("emailError").textContent = "";
      document.getElementById("passwordError").textContent = "";

      // Get form values
      var email = document.getElementById("email").value.trim();
      var password = document.getElementById("password").value.trim();

      var isValid = true;

      // Validate email
      var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(email)) {
        document.getElementById("emailError").textContent =
          "Please enter a valid email address.";
        isValid = false;
      }

      // Validate password
      if (password === "") {
        document.getElementById("passwordError").textContent =
          "Password is required.";
        isValid = false;
      } else if (password.length < 6) {
        document.getElementById("passwordError").textContent =
          "Password must be at least 6 characters long.";
        isValid = false;
      }

      // If all validations pass, submit the form
      if (isValid) {
        this.submit();
      }
    });
