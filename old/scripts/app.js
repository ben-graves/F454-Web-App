var app = angular.module("app", ['ngRoute']);

app.config(['$routProvider', function($routeProvider) {
      $routeProvider
      .when('/partialsetspage',
      {
        templateUrl : "partials/setspage.html"
      });
    }]);

/*angular.module("app").controller("setsController", function($scope, $routeParams, $http) {
      $scope.selectedSubject = $routeParams.subject
  });*/

angular.module("app").controller("setsController",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
    $scope.selectedSubject = $routeParams.subject
  }]);

angular.module("app").controller("editsetController", function($scope, $http) {

});

angular.module("app").controller("manualtestingController", function($scope, $http) {

});

angular.module("app").controller("startController", function($scope, $http) {

});

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

angular.module("app").controller("newsetController", function($scope, $http) {

  $scope.subjects = [
    "Computing",
    "Maths",
    "Physics",
    "Spanish"
  ];
});

angular.module("app").controller("setController", function($scope, $http) {
  $scope.set = {title : "Chapter 1",
                subject : "Computing"};
  $scope.flashcards = [
   {front:"to play", back:"jugar", learnt : "true"},
    {front:"to swim", back:"nadar", learnt : "false"},
    {front:"to paint", back:"pintar", learnt : "true"},
    {front:"to watch", back:"mirar", learnt : "true"},
    {front:"to please", back:"gustar", learnt : "true"},
    {front:"to attack", back:"atacar", learnt : "false"},
    {front:"to take", back: "sacar", learnt : "true"},
    {front:"to pray", back:"rezar", learnt : "false"},
    {front:"to get up", back:"levantar", learnt : "false"},
    {front:"to go for a walk", back:"pasear", learnt : "true"},
    {front:"to move", back:"mudar", learnt : "true"},
    {front:"to fix/repair/straighten up", back:"arreglar", learnt : "false"},
    {front:"to return/go back", back:"regresar", learnt : "true"},
    {front:"to turn in", back:"entregar", learnt : "true"},
    {front:"to enter", back:"entrar", learnt : "true"},
    {front:"to cease/end", back:"cesar", learnt : "false"},
    {front:"to play", back:"jugar", learnt : "true"},
     {front:"to swim", back:"nadar", learnt : "false"},
     {front:"to paint", back:"pintar", learnt : "true"},
    {front:"to watch", back:"mirar", learnt : "true"},
    {front:"to please", back:"gustar", learnt : "false"},
    {front:"to attack", back:"atacar", learnt : "false"},
    {front:"to take", back: "sacar", learnt : "false"},
    {front:"to pray", back:"rezar", learnt : "true"},
    {front:"to get up", back:"levantar", learnt : "true"},
    {front:"to go for a walk", back:"pasear", learnt : "true"},
    {front:"to move", back:"mudar", learnt : "true"},
    {front:"to fix/repair/straighten up", back:"arreglar", learnt : "false"},
    {front:"to return/go back", back:"regresar", learnt : "true"},
    {front:"to turn in", back:"entregar", learnt : "false"},
    {front:"to enter", back:"entrar", learnt : "true"},
    {front:"to cease/end", back:"cesar", learnt : "true"}
 ];
 for (i in $scope.flashcards){
   if ($scope.flashcards[i].learnt === "true"){
     $scope.flashcards[i].icon = "glyphicon glyphicon-ok icon-success"
     $scope.flashcards[i].bg = "success"
   } else {
     $scope.flashcards[i].icon = "glyphicon glyphicon-remove icon-danger"
     $scope.flashcards[i].bg = "danger"
   }
 }
});

angular.module("app").controller("subjectsController", function($scope, $http) {
  $scope.subjects = [
    {id: "1", name : "Computing", image : "images/subjects/Computing.png", learnt : 243, total : 457},
    {id: "2", name : "Maths", image : "images/subjects/Maths.png", learnt : 33, total : 42},
    {id: "3", name : "Physics", image : "images/subjects/Physics.png", learnt : 102, total : 287},
    {id: "4", name : "Spanish", image : "images/subjects/Languages.png", learnt : 357, total : 1133},
    {id: "5", name : "General Studies", image : "images/subjects/World Studies.png", learnt : 0, total : 56},
    {id: "6", name : "English", image : "images/subjects/English.png", learnt : 53, total : 457},
    {id: "7", name : "Biology", image : "images/subjects/Biology.png", learnt : 265, total : 301},
    {id: "8", name : "Chemistry", image : "images/subjects/Chemistry.png", learnt : 323, total : 503},
    {id: "9", name : "Geography", image : "images/subjects/Geography.png", learnt : 23, total : 453},
    {id: "10", name : "History", image : "images/subjects/History.png", learnt : 355, total : 376}
  ];

$scope.selectedSubject="No subject selected"
  $scope.selectSubject = function(subjectid) {
    $scope.selectedSubject=subjectid
    shareData.set($scope.selectedSubject);
    window.open("/setspage");
  };

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

angular.module("app").controller("newsubjectController", function($scope, $http) {
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
