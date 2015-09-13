var app = angular.module("app", [
  'ngRoute']).
  config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/', {templateUrl : 'partials/index.html', controller: "welcomeCtrl"});
      $routeProvider.when('/start/:userid', {templateUrl : 'partials/start.html', controller: "startCtrl"});
      $routeProvider.when('/newset/:userid', {templateUrl : 'partials/newset.html', controller: "newsetCtrl"});
      $routeProvider.when('/editset/:userid/:subjectid/:setid/:flashcardid', {templateUrl : 'partials/editset.html', controller: "editsetCtrl"});
      $routeProvider.when('/subjects/:userid', {templateUrl : 'partials/subjects.html', controller: "subjectsCtrl"});
      $routeProvider.when('/sets/:userid/:subjectid', {templateUrl : 'partials/sets.html', controller: "setsCtrl"});
      /*$routeProvider.otherwise({redirectTo : '/'});*/
    }]);


    angular.module("app").controller("welcomeCtrl", function($scope, $http) {

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


angular.module("app").controller("shellCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {

  }]);

angular.module("app").controller("startCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
  var userid = $routeParams.userid;
  var url = "http://localhost:5000/getname/userid="+userid+"/"
   $http.get(url).then(function(response) {
     // success
     var name = response.data;
     $scope.greeting = "Hi "+name+", "
   });
  }]);

angular.module("app").controller("newsetCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
  $scope.subjects = [
    "Computing",
    "Maths",
    "Physics",
    "Spanish"
  ];
    }]);


angular.module("app").controller("editsetCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {

    }]);

angular.module("app").controller("subjectsCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
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
    }]);

angular.module("app").controller("setsCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
  $scope.subject = "Computing"
  $scope.sets = [
    {id: "1", name : "Chapter 1", image : "images/subjects/Computing.png", learnt : 234, total : 323},
    {id: "2", name : "Chapter 2", image : "images/subjects/Computing.png", learnt : 146, total :147},
    {id: "3", name : "Chapter 3", image : "images/subjects/Computing.png", learnt : 12, total : 286},
    {id: "4", name : "Chapter 4", image : "images/subjects/Computing.png", learnt : 198, total : 243},
    {id: "5", name : "Chapter 5", image : "images/subjects/Computing.png", learnt : 23, total : 53},
  ];

  $scope.overall = {
    learnt : 0, total : 0
  };

  var setAmount = $scope.sets.length;

  var grades_array = ["U","U", "U", "F", "E", "D", "C", "B", "A", "A*", "A*"];

  for (i = 0; i < setAmount; i++){
    $scope.sets[i].percentage = Math.floor(($scope.sets[i].learnt/$scope.sets[i].total)*100)
    $scope.overall.learnt += $scope.sets[i].learnt;
    $scope.overall.total += $scope.sets[i].total;
    $scope.sets[i].grade = grades_array[parseInt($scope.sets[i].percentage/10)]
  }

  $scope.setAmount = setAmount

  $scope.overall.percentage = Math.floor(($scope.overall.learnt/$scope.overall.total)*100)
    }]);
