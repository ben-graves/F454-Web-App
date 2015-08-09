angular.module("app", []);

angular.module("app").controller("welcomeController", function($scope) {

  $scope.signupmessage = {
                        email : "",
                        firstname : "",
                        lastname : "",
                        dob : "",
                        username : "",
                        password : "",
                        retype : "",
  };

  $scope.signinmessage = {
                        username : "",
                        password : "",
  };

  var validatesignup = function(signupdetails) {
    if (signupdetails === undefined) {
      $scope.signupmessage.email = "Invalid email address"
      $scope.signupmessage.firstname = "Enter first name"
      $scope.signupmessage.lastname = "Enter last name"
      $scope.signupmessage.dob = "Enter date of bith"
      $scope.signupmessage.username = "Invalid username"
      $scope.signupmessage.password = "Enter password"
      $scope.signupmessage.retypepassword = "Renter password"
    }
    else {
      if (signupdetails.email === undefined) {
        $scope.signupmessage.email = "Invalid email address"
      }
      if (signupdetails.firstname === undefined) {
        $scope.signupmessage.firstname = "Enter first name"
      }
      if (signupdetails.lastname === undefined) {
        $scope.signupmessage.lastname = "Enter last name"
      }
      if (signupdetails.dob === null) {
        $scope.signupmessage.dob = "Enter date of bith"
      }
      if (signupdetails.username === undefined) {
        $scope.signupmessage.username = "Invalid username"
      }
      if (signupdetails.password === undefined) {
        $scope.signupmessage.password = "Enter password"
      }
      if (signupdetails.retypepassword === undefined) {
        $scope.signupmessage.retypepassword = "Renter password"
      }
      if (signupdetails.password != signupdetails.retypepassword) {
        $scope.signupmessage.retypepassword = "Passwords do not match"
      }
    }
  };

  var validatesignin = function(signindetails) {
    if (signindetails === undefined) {
      $scope.signinmessage.username = "Invalid username"
      $scope.signinmessage.password = "Enter password"
    }
    else {
      if (signindetails.username === undefined) {
        $scope.signinmessage.username = "Invalid username"
      }
      if (signindetails.password === undefined) {
        $scope.signinmessage.password = "Enter password"
      }
    }
  };

  $scope.signup = function(signupdetails) {
    validatesignup(signupdetails)
  };

  $scope.signin = function(signindetails) {
    validatesignin(signindetails)
  };

});
