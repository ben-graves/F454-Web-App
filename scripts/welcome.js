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
    var valid = true;
    if (signupdetails === undefined) {
      valid = false;
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
        valid = false;
        $scope.signupmessage.email = "Invalid email address"
      }
      else{
        $scope.signupmessage.email = ""
      }
      if (signupdetails.firstname === undefined) {
        valid = false;
        $scope.signupmessage.firstname = "Enter first name"
      }
      else{
        $scope.signupmessage.firstname = ""
      }
      if (signupdetails.lastname === undefined) {
        valid = false;
        $scope.signupmessage.lastname = "Enter last name"
      }
      else{
        $scope.signupmessage.lastname = ""
      }
      if (signupdetails.dob === undefined || signupdetails.dob === null) {
        valid = false;
        $scope.signupmessage.dob = "Enter date of bith"
      }
      else{
        $scope.signupmessage.dob = ""
      }
      if (signupdetails.username === undefined) {
        valid = false;
        $scope.signupmessage.username = "Invalid username"
      }
      else{
        $scope.signupmessage.username = ""
      }
      if (signupdetails.password === undefined) {
        valid = false;
        $scope.signupmessage.password = "Enter password"
      }
      else{
        $scope.signupmessage.password = ""
      }
      if (signupdetails.retypepassword === undefined) {
        valid = false;
        $scope.signupmessage.retypepassword = "Renter password"
      }
      else{
        $scope.signupmessage.retypepassword = ""
        if (signupdetails.password != signupdetails.retypepassword) {
          valid = false;
          $scope.signupmessage.retypepassword = "Passwords don't match"
        }
      }
    }
    return valid
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
    if (validatesignup(signupdetails)){
      console.log("valid")
      /*call api with /createuser*/


  };

  $scope.signin = function(signindetails) {
    return "no"
  }
  };

});
