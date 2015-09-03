angular.module("app", []);

angular.module("app").controller("welcomeController", function($scope, $http) {

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
        angular.element(document.querySelector('[id="emailbox"]')).addClass('has-error');
        angular.element(document.querySelector('[id="emailicon"]')).addClass('glyphicon glyphicon-remove form-control-feedback');
      }
      else{
        $scope.signupmessage.email = ""
        angular.element(document.querySelector('[id="emailbox"]')).addClass('has-success');
        angular.element(document.querySelector('[id="emailicon"]')).addClass('glyphicon glyphicon-ok form-control-feedback');
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
      var url = "http://localhost:5000/createuser/firstname="+signupdetails.firstname+"/lastname="+signupdetails.lastname+"/dob=1997-12-27/emailaddress="+signupdetails.email+"/username="+signupdetails.username+"/password="+signupdetails.password+"/"
      $http.get(url)
      .then(function(response) {
        console.log(response)
        if (response.data === "Success") {
          document.cookie="username="+signupdetails.username;
          window.open('/startpage',"_self")
        }
        else if (response.data === "Username Taken") {
          $scope.signupmessage.username = "Username Taken"
        }
      });
  };
  $scope.signin = function(signindetails) {
    return "no"
  }
  };
});

angular.module("app").controller("startController", function($scope) {
  $scope.username = document.cookie;
});

angular.module("app").controller("newsetController", function($scope) {
  $scope.subjects = [
    "Computing",
    "Maths",
    "Physics",
    "Spanish"
  ];
});

angular.module("app").controller("setController", function($scope) {
  $scope.set = {title : "Chapter 1",
                subject : "Computing"};
  $scope.flashcards = [
   {front:"to play", back:"jugar", learnt : "yes"},
    {front:"to swim", back:"nadar", learnt : "no"},
    {front:"to paint", back:"pintar", learnt : "yes"},
{front:"to watch", back:"mirar", learnt : "yes"},
{front:"to please", back:"gustar", learnt : "yes"},
{front:"to attack", back:"atacar", learnt : "yes"},
{front:"to take", back: "sacar", learnt : "yes"},
{front:"to pray", back:"rezar", learnt : "yes"},
{front:"to get up", back:"levantar", learnt : "yes"},
{front:"to go for a walk", back:"pasear", learnt : "yes"},
{front:"to move", back:"mudar", learnt : "yes"},
{front:"to fix/repair/straighten up", back:"arreglar", learnt : "yes"},
{front:"to return/go back", back:"regresar", learnt : "yes"},
{front:"to turn in", back:"entregar", learnt : "yes"},
{front:"to enter", back:"entrar", learnt : "yes"},
{front:"to cease/end", back:"cesar", learnt : "yes"},
{front:"to play", back:"jugar", learnt : "yes"},
 {front:"to swim", back:"nadar", learnt : "no"},
 {front:"to paint", back:"pintar", learnt : "yes"},
{front:"to watch", back:"mirar", learnt : "yes"},
{front:"to please", back:"gustar", learnt : "yes"},
{front:"to attack", back:"atacar", learnt : "yes"},
{front:"to take", back: "sacar", learnt : "yes"},
{front:"to pray", back:"rezar", learnt : "yes"},
{front:"to get up", back:"levantar", learnt : "yes"},
{front:"to go for a walk", back:"pasear", learnt : "yes"},
{front:"to move", back:"mudar", learnt : "yes"},
{front:"to fix/repair/straighten up", back:"arreglar", learnt : "yes"},
{front:"to return/go back", back:"regresar", learnt : "yes"},
{front:"to turn in", back:"entregar", learnt : "yes"},
{front:"to enter", back:"entrar", learnt : "yes"},
{front:"to cease/end", back:"cesar", learnt : "yes"}
 ];
});

angular.module("app").controller("subjectsController", function($scope, $http) {
  $scope.subjects = [
    {name : "Computing", image : "images/subjects/Computing.png", learnt : 243, total : 457},
    {name : "Maths", image : "images/subjects/Maths.png", learnt : 33, total : 42},
    {name : "Physics", image : "images/subjects/Physics.png", learnt : 102, total : 287},
    {name : "Spanish", image : "images/subjects/Languages.png", learnt : 357, total : 1133},
    {name : "General Studies", image : "images/subjects/Other.png", learnt : 0, total : 56},
    {name : "English", image : "images/subjects/English.png", learnt : 53, total : 457},
    {name : "Biology", image : "images/subjects/Biology.png", learnt : 265, total : 301},
    {name : "Chemistry", image : "images/subjects/Chemistry.png", learnt : 323, total : 503},
    {name : "Geography", image : "images/subjects/Other.png", learnt : 23, total : 453},
    {name : "History", image : "images/subjects/History.png", learnt : 355, total : 376}
  ];

  $scope.overall = {
    learnt : 0, total : 0
  };

  var subjectAmount = $scope.subjects.length;

  for (i = 0; i < subjectAmount; i++){
    $scope.subjects[i].percentage = Math.floor(($scope.subjects[i].learnt/$scope.subjects[i].total)*100)
    $scope.overall.learnt += $scope.subjects[i].learnt;
    $scope.overall.total += $scope.subjects[i].total;
  }
  $scope.overall.percentage = Math.floor(($scope.overall.learnt/$scope.overall.total)*100)
});

angular.module("app").controller("newsubjectController", function($scope) {

});

angular.module('app').controller('imagesController', function ($scope) {
  $scope.subjectimages = [
    "images/subjects/Other.png",
    "images/subjects/Biology.png",
    "images/subjects/Chemistry.png",
    "images/subjects/Physics.png",
    "images/subjects/Computing.png",
    "images/subjects/Maths.png",
    "images/subjects/Economics.png",
    "images/subjects/English.png",
    "images/subjects/Literature.png",
    "images/subjects/History.png",
    "images/subjects/Geography.png",
    "images/subjects/World Studies.png",
    "images/subjects/Languages.png",
    "images/subjects/Art.png",
    "images/subjects/Astronomy.png",
    "images/subjects/Mechanics.png",
    "images/subjects/Nature.png",
    "images/subjects/Navigation.png",
    "images/subjects/Photography.png",
    "images/subjects/Psychology.png",
    "images/subjects/RE.png",
    "images/subjects/Sport.png",
    "images/subjects/Statistics.png",
    "images/subjects/Veterinary.png",




  ];
});
