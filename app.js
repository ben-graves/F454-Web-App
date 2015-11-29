//create angular app, bringing in ngRoute
var app = angular.module("app", ['ngRoute']).
  config(['$routeProvider', function($routeProvider) {
      //ser up route provider, to load the correct parcial html file into the master html file and bring in the parameters
      $routeProvider.when('/', {templateUrl : 'partials/index.html', controller: "welcomeCtrl"});
      $routeProvider.when('/start/:userid', {templateUrl : 'partials/start.html', controller: "startCtrl"});
      $routeProvider.when('/newset/:userid', {templateUrl : 'partials/newset.html', controller: "newsetCtrl"});
      $routeProvider.when('/editset/:userid/:subjectid/:setid/:flashcardid', {templateUrl : 'partials/editset.html', controller: "editsetCtrl"});
      $routeProvider.when('/subjects/:userid', {templateUrl : 'partials/subjects.html', controller: "subjectsCtrl"});
      $routeProvider.when('/sets/:userid/:subjectid', {templateUrl : 'partials/sets.html', controller: "setsCtrl"});
      $routeProvider.when('/set/grid/:userid/:setid', {templateUrl : 'partials/setgrid.html', controller: "setCtrl"});
      $routeProvider.when('/set/list/:userid/:setid', {templateUrl : 'partials/setlist.html', controller: "setCtrl"});
      $routeProvider.when('/manual/:userid/:setid/:shuffle/:unlearntonly', {templateUrl : 'partials/manual.html', controller: "manualCtrl"});
      $routeProvider.when('/multiplechoice/:userid/:setid/:shuffle/:unlearntonly', {templateUrl : 'partials/multiplechoice.html', controller: "multiplechoiceCtrl"});
      $routeProvider.when('/typedanswer/:userid/:setid/:shuffle/:unlearntonly', {templateUrl : 'partials/typedanswer.html', controller: "typedanswerCtrl"});
      $routeProvider.when('/summary/:userid/:setid', {templateUrl : 'partials/summary.html', controller: "summaryCtrl"});

      //link to not found page for incorrect routes
      $routeProvider.otherwise({templateUrl : 'partials/notfound.html'});
    }]);

    //controller for shell that can be used if required
    angular.module("app").controller("shellCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
      }]);

    //welcome controller to provide data for the welcome page
    angular.module("app").controller("welcomeCtrl", function($scope, $http) {

      //initialise error message object for each field of the sign up form
      $scope.signupmessage = {
                            email : "",
                            firstname : "",
                            lastname : "",
                            dob : "",
                            username : "",
                            password : "",
                            retype : "",
      };

      //initialise error message object for each field of the sign in form
      $scope.signinmessage = {
                            username : "",
                            password : "",
      };

      //set up validation function for sign up form
      var validatesignup = function(signupdetails) {
        var valid = true;
        //check that details have been entered, if not add error messages to all fields, and set valid boolean to false
        if (signupdetails === undefined) {
          valid = false;
          $scope.signupmessage.email = "Invalid email address"
          $scope.signupmessage.lastname = "Enter last name"
          $scope.signupmessage.dob = "Enter date of bith"
          $scope.signupmessage.username = "Invalid username"
          $scope.signupmessage.password = "Enter password"
          $scope.signupmessage.retypepassword = "Renter password"
        }
        //else some or all details have been entered
        else {
          //check each field in turn to see if anything has been entered
          if (signupdetails.email === undefined) {
            //if not set error message accordingly and valid boolean to false
            valid = false;
            $scope.signupmessage.email = "Invalid email address"
          }
          else{
            //if say clear error message
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
        //return the valid boolean
        return valid
      };

      //set up validation function for sign up form
      var validatesignin = function(signindetails) {
        var valid = true
        if (signindetails === undefined) {
          $scope.signinmessage.username = "Invalid username"
          $scope.signinmessage.password = "Enter password"
          valid = false
        }
        else {
          if (signindetails.username === undefined) {
            $scope.signinmessage.username = "Invalid username"
            valid = false
          }
          if (signindetails.password === undefined) {
            $scope.signinmessage.password = "Enter password"
            valid = false
          }
        }
        return valid
      };

      //sign up function
      $scope.signup = function(signupdetails) {
        console.log("here")
        //check validity
        if (validatesignup(signupdetails)){
          //if valid, set up API url for creating a user
          var url = "http://localhost:5000/createuser/firstname="+signupdetails.firstname+"/lastname="+signupdetails.lastname+"/dob=1997-12-27/emailaddress="+signupdetails.email+"/username="+signupdetails.username+"/password="+signupdetails.password+"/"
           $http.get(url)
            .then(function(response) {
              //once response has been recieved, check to see if the creation was successful. If successful the new user's ID will be returned, if not "Username Taken" will be returned
              if (response.data === "Username Taken") {
                //if username is taken, update error message accordingly
                $scope.signupmessage.username = "Username Taken"
              }
              else  {
                //if not, use the returned user ID to open the correct route for the user's start page
                var userid = response.data
                window.open("/#/start/"+userid, "_self");
              }
            });
          };
      };

      $scope.signin = function(signindetails) {
        $scope.signinmessage.password = ""
        $scope.signinmessage.username = ""
        if (validatesignin(signindetails)) {
          url = "http://localhost:5000/signin/username="+signindetails.username+"/password="+signindetails.password
          $http.get(url)
           .then(function(response) {
             if (response.data == "Incorrect Password") {
               $scope.signinmessage.password = "Incorrect Password"
             }
             else if (response.data == "Unknown User") {
               $scope.signinmessage.username = "Unknown User"
             }
             else {
               var userid = response.data
               window.open("/#/start/"+userid, "_self");
             }
           });

        }
      };
  });

//controller for manual testing page
angular.module("app").controller("manualCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
  //set up system to check that the user is sure if they try to leave the page as they many lose their progress
  var confirmOnPageExit = function (e)
{
    //if we haven't been passed the event get the window.event
    e = e || window.event;

    //create message to explain reason for pop-up
    var message = 'Ending this learning session will result in the loss of unsaved data';
    //for IE6-8 and Firefox prior to version 4
    if (e)
    {
        e.returnValue = message;
    }
    //for Chrome, Safari, IE8+ and Opera 12+
    return message;
};
window.onbeforeunload = confirmOnPageExit;

  //get route parameters and assign them to $scope and js variables
  var userid = $routeParams.userid
  $scope.userid = userid

  var setid = $routeParams.setid
  $scope.setid = setid

  var shuffle = $routeParams.shuffle
  var unlearntonly = $routeParams.unlearntonly

  //get progress data of set
  var url = "http://localhost:5000/getlearntandtotal/setid="+setid
  $http.get(url)
   .then(function(response) {
     $scope.total = response.data.total
     $scope.learnt = response.data.learnt
     $scope.percentage = Math.floor($scope.learnt/$scope.total*100)
   });

   //create search function to be run when user presses search button, with parameter of front content
   $scope.search = function(front) {
     //set up google url in format "https://www.google.co.uk/#q=query+with+pluses+instead+of+spaces"
     var url = "https://www.google.co.uk/#q="+front.replace(" ","+")
     //open url in new tab
     window.open(url, '_blank').focus();
   };

   //create wikipedia function to be run when user presses wikipedia button, with parameter of front content
   $scope.wiki = function(front) {
     //set up wikipedia url in format "https://en.wikipedia.org/wiki/query_with_underscores_instead_of_spaces"
     var url = "https://en.wikipedia.org/wiki/"+front.replace(" ","_")
     //open url in new tab
     window.open(url, '_blank').focus();
   };

  //set up API url to get the contents of cards, with parameters of set ID and shuffle and unlearntonly booleans.
  var url = "http://localhost:5000/getcardstolearn/setid="+setid+"/shuffle="+shuffle+"/unlearntonly="+unlearntonly;
  $http.get(url)
   .then(function(response) {
     //returns array of objects, one for each card in the following format:
     //{front:"front content", back:"back content", learnt:1/0, grade:"grade of card"}
     $scope.flashcards = response.data
     var url = "http://localhost:5000/getsetdetails/setid="+setid;
     $http.get(url)
      .then(function(response) {
        //returns details of set in object following format:
        //{name:"set name", "predicted_grade": "current grade based on progress", learnt: number of learnt cards (integer), total: total number of cards (integer), examdate: "date of exam", subjectid: if of subject, setid: id of set}
        $scope.set = response.data
      });
      //set first card to active as this will be the first to be displayed
     $scope.flashcards[0].active = "active"
     //convert boolean variables from format in sql database (1/0) to format in js (true/false)
     for (i=0; i < $scope.flashcards.length; i++) {
       if ($scope.flashcards[i].learnt === 1) {
         $scope.flashcards[i].learnt = true
       } else {
         $scope.flashcards[i].learnt = false
       }
       }
     });

     //function to be called each time checkbox is clicked to change the learn value of each card
    $scope.changelearnt = function(card){
      //set up API url to change learnt of card
      var url = "http://localhost:5000/changelearnt/flashcardid="+card.flashcardid+"/learnt="+card.learnt
      $http.get(url).then(function(response) {
        //update learnt and total cards data
        var url = "http://localhost:5000/getlearntandtotal/setid="+setid
        $http.get(url)
         .then(function(response) {
           $scope.total = response.data.total
           $scope.learnt = response.data.learnt
           $scope.percentage = Math.floor($scope.learnt/$scope.total*100)
           //update set details
           var url = "http://localhost:5000/getsetdetails/setid="+setid;
           $http.get(url)
            .then(function(response) {
              $scope.set = response.data
            });
         });
    });
  };

    }]);

    angular.module("app").controller("typedanswerCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
      //set up system to check that the user is sure if they try to leave the page as they many lose their progress
      var confirmOnPageExit = function (e)
    {
        //if we haven't been passed the event get the window.event
        e = e || window.event;

        //create message to explain reason for pop-up
        var message = 'Ending this learning session will result in the loss of unsaved data';
        //for IE6-8 and Firefox prior to version 4
        if (e)
        {
            e.returnValue = message;
        }
        //for Chrome, Safari, IE8+ and Opera 12+
        return message;
    };
    window.onbeforeunload = confirmOnPageExit;

    //set route parameters to $scope and js variables
    var userid = $routeParams.userid
    $scope.userid = userid

    var setid = $routeParams.setid
    $scope.setid = setid

    var shuffle = $routeParams.shuffle
    var unlearntonly = $routeParams.unlearntonly

    //initialise variables
    $scope.correct = 0
    $scope.incorrect = 0
    $scope.correctpercentage = 0
    $scope.incorrectpercentage = 0

    //get number of cards and learnt cards
    var url = "http://localhost:5000/getlearntandtotal/setid="+setid
    $http.get(url)
     .then(function(response) {
       $scope.total = response.data.total
       $scope.learnt = response.data.learnt
       //calculate percentage, reducing to last whole number, this way 100% will not be given until all cards are learnt
       $scope.percentage = Math.floor($scope.learnt/$scope.total*100)
     });

     //create search function to be run when user presses search button, with parameter of front content
     $scope.search = function(front) {
       //set up google url in format "https://www.google.co.uk/#q=query+with+pluses+instead+of+spaces"
       var url = "https://www.google.co.uk/#q="+front.replace(" ","+")
       //open url in new tab
       window.open(url, '_blank').focus();
     };

     //create wikipedia function to be run when user presses wikipedia button, with parameter of front content
     $scope.wiki = function(front) {
       //set up wikipedia url in format "https://en.wikipedia.org/wiki/query_with_underscores_instead_of_spaces"
       var url = "https://en.wikipedia.org/wiki/"+front.replace(" ","_")
       //open url in new tab
       window.open(url, '_blank').focus();
     };

    //set up API url to get the contents of cards, with parameters of set ID and shuffle and unlearntonly booleans.
    var url = "http://localhost:5000/getcardstolearn/setid="+setid+"/shuffle="+shuffle+"/unlearntonly="+unlearntonly;
    $http.get(url)
     .then(function(response) {
       //returns array of objects, one for each card in the following format:
       //{front:"front content", back:"back content", learnt:1/0, grade:"grade of card"}
       $scope.flashcards = response.data
       var url = "http://localhost:5000/getsetdetails/setid="+setid;
       $http.get(url)
        .then(function(response) {
          //returns details of set in object following format:
          //{name:"set name", "predicted_grade": "current grade based on progress", learnt: number of learnt cards (integer), total: total number of cards (integer), examdate: "date of exam", subjectid: if of subject, setid: id of set}
          $scope.set = response.data
        });
       //initialise cards remaining variable
       $scope.cardsremaining = $scope.flashcards.length

       //set first card to active as this will mean it is displayed first
       $scope.flashcards[0].active = "active"

       //convert from sql database format boolean (1/0), to js format (true/ false)
       for (i=0; i < $scope.flashcards.length; i++) {
         if ($scope.flashcards[i].learnt === 1) {
           $scope.flashcards[i].learnt = true
         } else {
           $scope.flashcards[i].learnt = false
         }
         }
       });

      //initialise function to change learnt boolean of cards
      $scope.changelearnt = function(card){
        //set up API url
        var url = "http://localhost:5000/changelearnt/flashcardid="+card.flashcardid+"/learnt="+card.learnt
        //call API
        $http.get(url).then(function(response) {
          //set up API url to update learnt and total data
          var url = "http://localhost:5000/getlearntandtotal/setid="+setid
          $http.get(url)
           .then(function(response) {
             //update variables
             $scope.total = response.data.total
             $scope.learnt = response.data.learnt
             $scope.percentage = Math.floor($scope.learnt/$scope.total*100)
             //update set details
             var url = "http://localhost:5000/getsetdetails/setid="+setid;
             $http.get(url)
              .then(function(response) {
                $scope.set = response.data
              });
           });
      });
    };

    //hide next button once pressed, as the next question will be loaded, so the next button must be hidden until a
    $scope.next = function(){
      $("#righticon").removeClass("glyphicon-chevron-right");
      $("#rightbutton").removeClass("right");
    }

    //function what will be called each time a key is released, if answer is blank the submit button is hidden, if not it is shown
    $scope.showhidesubmit = function(answer, index){
      if (answer === "") {
        $("#submitbutton"+index).addClass("hidden");
      } else{
        $("#submitbutton"+index).removeClass("hidden");
      }
    }

    //function to be called when submit button is pressed
    $scope.submit = function(typedanswer, correctanswer, index){
      //show the next card button
      $("#righticon").addClass("glyphicon-chevron-right");
      $("#rightbutton").addClass("right");

      //once answer is submitted, make the input box read only, so that the user cannot edit their answer after submitting
      $("#backentry"+index).attr('readonly', true);

      //hide submit button
      $("#submitbutton"+index).addClass("hidden");

      //take one off remaining cards variable
      $scope.cardsremaining -= 1
      //check if answer is correct, case insensitive
      if (typedanswer.toLowerCase() === correctanswer.toLowerCase()){
        //if correct, format input box to be green
        angular.element(document.querySelector('[id="answerbox'+index+'"]')).addClass('has-success');

        //add tick to end of input box
        angular.element(document.querySelector('[id="answericon'+index+'"]')).addClass('glyphicon glyphicon-ok form-control-feedback');

        //update variables
        $scope.correct += 1
        $scope.correctpercentage = ($scope.correct/$scope.flashcards.length)*100

        //change learnt of card, setting learnt to true
        var url = "http://localhost:5000/changelearnt/flashcardid="+$scope.flashcards[index].flashcardid+"/learnt=true"
        //call api, no need to wait as no response
        $http.get(url)
      }
      else{
        //incorrect answer
        //show box containing correction
        $("#correctionbox"+index).removeClass("hidden");
        $scope.incorrect += 1
        $scope.incorrectpercentage = ($scope.incorrect/$scope.flashcards.length)*100
        //format input box to be red
        angular.element(document.querySelector('[id="answerbox'+index+'"]')).addClass('has-error');

        //add cross to end of input box
        angular.element(document.querySelector('[id="answericon'+index+'"]')).addClass('glyphicon glyphicon-remove form-control-feedback');

        //change learnt boolean to false
        var url = "http://localhost:5000/changelearnt/flashcardid="+$scope.flashcards[index].flashcardid+"/learnt=false"
        $http.get(url)
      }
    }
    //create search function to be run when user presses search button, with parameter of front content
    $scope.search = function(front) {
      //set up google url in format "https://www.google.co.uk/#q=query+with+pluses+instead+of+spaces"
      var url = "https://www.google.co.uk/#q="+front.replace(" ","+")
      //open url in new tab
      window.open(url, '_blank').focus();
    };

    //create wikipedia function to be run when user presses wikipedia button, with parameter of front content
    $scope.wiki = function(front) {
      //set up wikipedia url in format "https://en.wikipedia.org/wiki/query_with_underscores_instead_of_spaces"
      var url = "https://en.wikipedia.org/wiki/"+front.replace(" ","_")
      //open url in new tab
      window.open(url, '_blank').focus();
    };
  }]);

//start page controller, to supply data required for start page
angular.module("app").controller("startCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
  //set userID route parameter to angular $scope variable and js variable
  var userid = $routeParams.userid;
  $scope.userid = userid
  //get the users name to set up unique message
  var url = "http://localhost:5000/getname/userid="+userid+"/"
   $http.get(url).then(function(response) {
     //create message
     var name = response.data;
     $scope.greeting = "Hi "+name+", "
   });
  }]);

//new set controller to give the new set page functionality
angular.module("app").controller("newsetCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
  //set user if variables for route parameters
  var userid = $routeParams.userid
  $scope.userid = $routeParams.userid

  //get the users subjects for the subjects dropdown
  var url = "http://localhost:5000/getsubjects/userid="+userid
  $http.get(url)
   .then(function(response) {
     $scope.subjects = response.data
   });

  $scope.addcards = function(setdetails){
    //format date into YYYY-MM-DD as required for db
    formatteddate = setdetails.examdate.getFullYear()+"-"+setdetails.examdate.getMonth()+"-"+setdetails.examdate.getDate()
    //url of dbquery api to create new set
    url = "http://localhost:5000/createset/subjectid="+setdetails.subject+"/name="+setdetails.name+"/examdate="+formatteddate
    $http.get(url)
     .then(function(response) {
       //open edit set with new set: response.data = setid of new set
       window.open("/#/editset/"+userid+"/"+setdetails.subject+"/"+response.data, "_self");
      });
    };
}]);

//edit set controller to provide data and services to the edit set page
angular.module("app").controller("editsetCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
  //set up system to check that the user is sure if they try to leave the page as they many lose their progress
  var confirmOnPageExit = function (e)
  {
      //if we haven't been passed the event get the window.event
      e = e || window.event;

      var message = 'Any unsaved cards will be lost';
      //for IE6-8 and Firefox prior to version 4
      if (e)
      {
          e.returnValue = message;
      }
      //for Chrome, Safari, IE8+ and Opera 12+
      return message;
  };
  //call confirmOnPageExit when user tries to leave page
  window.onbeforeunload = confirmOnPageExit;

  //set variables to route parameters
  var userid = $routeParams.userid
  var subjectid = $routeParams.subjectid
  var setid = $routeParams.setid
  var flashcardid = $routeParams.flashcardid

  $scope.userid = $routeParams.userid

  //get flashcard data
  var url = "http://localhost:5000/getflashcard/setid="+setid+"/flashcardid="+flashcardid
   $http.get(url)
    .then(function(response) {
      //returns object of following format:
      //{flashcardid:id of flashcard (integer)
      // front:"front content"
      // back:"back content"
      // grade:"grade of flashcard"
      // typeid:id of type (integer)
      // setid:id of set (integer)}
      $scope.carddetails = response.data
      $scope.carddetails.cardtype = (parseInt($scope.carddetails.typeid) - 1).toString()

      //ge information about the card within in the set
      var url = "http://localhost:5000/getcardsetdetails/subjectid="+subjectid+"/setid="+setid+"/flashcardid="+flashcardid
      $http.get(url)
       .then(function(response) {
         //returns object of following format:
         //{totalcards:total number of cards (integer),
         // flashcardsidlist:array of flashcards ids in set,
         // cardno:the index of the current card (not the id),
         // nextid:the id of the next card,
         // previd:the id of the previous card,
         // setname: name of set
         // subjectname: name of subject}
         $scope.cardsetdetails = response.data
        });
    });

    //function to be called when the next card button is pressed
    $scope.nextcard = function(carddetails) {
      carddetails.typeid = (parseInt(carddetails.cardtype) + 1).toString();
      //save current flashcard
      var url = "http://localhost:5000/saveflashcard/setid="+carddetails.setid+"/flashcardid="+carddetails.flashcardid+"/typeid="+carddetails.typeid+"/front="+carddetails.front+"/back="+carddetails.back+"/grade="+carddetails.grade+"/learnt="+carddetails.learnt
      $http.get(url).then(function(response) {
        //open next card in same tab
        window.open("/#/editset/"+userid+"/"+subjectid+"/"+setid+"/"+$scope.cardsetdetails.nextid, "_self");
      });
    }

    //function to be called when the previous card button is pressed
    $scope.previouscard = function(carddetails) {
      carddetails.typeid = (parseInt(carddetails.cardtype) + 1).toString();
      //save current card
      var url = "http://localhost:5000/saveflashcard/setid="+carddetails.setid+"/flashcardid="+carddetails.flashcardid+"/typeid="+carddetails.typeid+"/front="+carddetails.front+"/back="+carddetails.back+"/grade="+carddetails.grade+"/learnt="+carddetails.learnt
      $http.get(url).then(function(response) {
        //open previous card in same tab
        window.open("/#/editset/"+userid+"/"+subjectid+"/"+setid+"/"+$scope.cardsetdetails.previd, "_self");
      });
    }

    //function to be called when save card button is pressed
    $scope.save = function(carddetails) {
      carddetails.typeid = (parseInt(carddetails.cardtype) + 1).toString();
      //save current card
      var url = "http://localhost:5000/saveflashcard/setid="+carddetails.setid+"/flashcardid="+carddetails.flashcardid+"/typeid="+carddetails.typeid+"/front="+carddetails.front+"/back="+carddetails.back+"/grade="+carddetails.grade+"/learnt="+carddetails.learnt
      $http.get(url).then(function(response) {
        //open set page
        window.open("/#/start/"+userid, "_self");
      });
    }

    //function to be called when auto define button is pressed
    $scope.autoDefine =  function(front, type) {
        //check what type the card
        //term and defintion
        if (type === "0"){
            //select function to be called the user selects a definition
            $scope.select = function(selected){
              //add selected defintion to back input box
              $('#flashcardback').val($('#flashcardback').val() + selected+'\n');
              //add selected definition to back variable
              $scope.carddetails.back = $scope.carddetails.back + selected+'\n'
            };
          //set titles for definitions and wikipedia to searching, then will be undated when results arrive
          $scope.definitions_title = "Searching Dictionairy..."
          $scope.wikipedia_title = "Searching Wikipedia..."
          //show the autodefine pop-up box
          $('#autoDefine').modal({
              show: 'true'
            });
          //set up url to search definitions
          var url = "http://localhost:5001/definitions/term="+front+"/"
           $http.get(url)
            .then(function(response) {
              //returns array of definitons
              $scope.definitions = response.data
              //update title to number of defintions found
              $scope.definitions_title = $scope.definitions.length+" Definitions Found"
              //set up variable for first result
              $scope.firstResult = $scope.definitions[0]
              //set up selected object
              $scope.selected = {}
              //set the selected text to the first result, so in the radio buttons it will be automatically selected at first
              $scope.selected.text = $scope.firstResult
              //search wikipedia
              var url = "http://localhost:5001/titleandarticle/term="+front+"/"
              $http.get(url)
               .then(function(response) {
                 //returns array or objects of following format:
                 //{title:"article title",
                 // text:"first sentance of article",
                 // link:"link to article"}
                 $scope.articles = response.data
                 //update wikipedia title to number of results
                 $scope.wikipedia_title = $scope.articles.length+" Wikipedia Articles Found"
               });
            });
          }
          //question and answer
          else if (type === "1") {
            //show search pop-up box
            $('#searchPrompt').modal({
                show: 'true'
              });
          }
          //term and translation
          else if (type === "2") {
            //set up language lists of objects
            //top languages to be displayed at top of list
            $scope.toplanguages = [{'name': 'English', 'code': 'en'},
                                   {'name': 'French', 'code': 'fr'},
                                   {'name': 'Spanish', 'code': 'es'},
                                   {'name': 'German', 'code': 'de'},
                                   {'name': "Chinese", "code": 'zh'}]
            //all languages
            $scope.alllanguages = [{'name': 'Afrikaans', 'code': 'af'}, {'name': 'Albanian', 'code': 'sq'}, {'name': 'Arabic', 'code': 'ar'}, {'name': 'Armenian', 'code': 'hy'}, {'name': 'Azerbaijani', 'code': 'az'}, {'name': 'Basque', 'code': 'eu'}, {'name': 'Belarusian', 'code': 'be'}, {'name': 'Bengali', 'code': 'bn'}, {'name': 'Bosnian', 'code': 'bs'}, {'name': 'Bulgarian', 'code': 'bg'}, {'name': 'Catalan', 'code': 'ca'}, {'name': 'Cebuano', 'code': 'ceb'}, {'name': 'Chichewa', 'code': 'ny'}, {'name': 'Chinese', 'code': 'zh'}, {'name': 'Chinese (Simplified)', 'code': 'zh-CN'}, {'name': 'Chinese (Traditional)', 'code': 'zh-TW'}, {'name': 'Croatian', 'code': 'hr'}, {'name': 'Czech', 'code': 'cs'}, {'name': 'Danish', 'code': 'da'}, {'name': 'Dutch', 'code': 'nl'}, {'name': 'English', 'code': 'en'}, {'name': 'Esperanto', 'code': 'eo'}, {'name': 'Estonian', 'code': 'et'}, {'name': 'Filipino', 'code': 'tl'}, {'name': 'Finnish', 'code': 'fi'}, {'name': 'French', 'code': 'fr'}, {'name': 'Galician', 'code': 'gl'}, {'name': 'Georgian', 'code': 'ka'}, {'name': 'German', 'code': 'de'}, {'name': 'Greek', 'code': 'el'}, {'name': 'Gujarati', 'code': 'gu'}, {'name': 'Haitian Creole', 'code': 'ht'}, {'name': 'Hausa', 'code': 'ha'}, {'name': 'Hebrew', 'code': 'iw'}, {'name': 'Hindi', 'code': 'hi'}, {'name': 'Hmong', 'code': 'hmn'}, {'name': 'Hungarian', 'code': 'hu'}, {'name': 'Icelandic', 'code': 'is'}, {'name': 'Igbo', 'code': 'ig'}, {'name': 'Indonesian', 'code': 'id'}, {'name': 'Irish', 'code': 'ga'}, {'name': 'Italian', 'code': 'it'}, {'name': 'Japanese', 'code': 'ja'}, {'name': 'Javanese', 'code': 'jw'}, {'name': 'Kannada', 'code': 'kn'}, {'name': 'Kazakh', 'code': 'kk'}, {'name': 'Khmer', 'code': 'km'}, {'name': 'Korean', 'code': 'ko'}, {'name': 'Lao', 'code': 'lo'}, {'name': 'Latin', 'code': 'la'}, {'name': 'Latvian', 'code': 'lv'}, {'name': 'Lithuanian', 'code': 'lt'}, {'name': 'Macedonian', 'code': 'mk'}, {'name': 'Malagasy', 'code': 'mg'}, {'name': 'Malay', 'code': 'ms'}, {'name': 'Malayalam', 'code': 'ml'}, {'name': 'Maltese', 'code': 'mt'}, {'name': 'Maori', 'code': 'mi'}, {'name': 'Marathi', 'code': 'mr'}, {'name': 'Mongolian', 'code': 'mn'}, {'name': 'Myanmar (Burmese)', 'code': 'my'}, {'name': 'Nepali', 'code': 'ne'}, {'name': 'Norwegian', 'code': 'no'}, {'name': 'Persian', 'code': 'fa'}, {'name': 'Polish', 'code': 'pl'}, {'name': 'Portuguese', 'code': 'pt'}, {'name': 'Punjabi', 'code': 'pa'}, {'name': 'Romanian', 'code': 'ro'}, {'name': 'Russian', 'code': 'ru'}, {'name': 'Serbian', 'code': 'sr'}, {'name': 'Sesotho', 'code': 'st'}, {'name': 'Sinhala', 'code': 'si'}, {'name': 'Slovak', 'code': 'sk'}, {'name': 'Slovenian', 'code': 'sl'}, {'name': 'Somali', 'code': 'so'}, {'name': 'Spanish', 'code': 'es'}, {'name': 'Sundanese', 'code': 'su'}, {'name': 'Swahili', 'code': 'sw'}, {'name': 'Swedish', 'code': 'sv'}, {'name': 'Tajik', 'code': 'tg'}, {'name': 'Tamil', 'code': 'ta'}, {'name': 'Telugu', 'code': 'te'}, {'name': 'Thai', 'code': 'th'}, {'name': 'Turkish', 'code': 'tr'}, {'name': 'Ukrainian', 'code': 'uk'}, {'name': 'Urdu', 'code': 'ur'}, {'name': 'Uzbek', 'code': 'uz'}, {'name': 'Vietnamese', 'code': 'vi'}, {'name': 'Welsh', 'code': 'cy'}, {'name': 'Yiddish', 'code': 'yi'}, {'name': 'Yoruba', 'code': 'yo'}, {'name': 'Zulu', 'code': 'zu'}]

            //translate function to be run when translate button is pressed
            $scope.translate = function (langfrom, langto) {
              //set up API url to get translate
              var url = "http://localhost:5001/translate/term="+front+"/langfrom="+langfrom+"/langto="+langto+"/"
              //call api
              $http.get(url)
               .then(function(response) {
                 //add translation to back input box
                 $('#flashcardback').val($('#flashcardback').val() + response.data+'\n');
                 //add translation to back variable
                 $scope.carddetails.back = $scope.carddetails.back + response.data+'\n'
               });
            }
            //show tranlation pop-up box
            $('#autoTranslate').modal({
                show: 'true'
              });

          }
          //other
          else  {
            //show error pop-up box
            $('#errorBox').modal({
                show: 'true'
              });
          }

        }

  //search variable to be called when searhc button pressed
  $scope.search = function(front) {
    //set up google url in format "https://www.google.co.uk/#q=query+with+pluses+instead+of+spaces"
    var url = "https://www.google.co.uk/#q="+front.replace(" ","+")
    //open url in new tab
    window.open(url, '_blank').focus();
  };
}]);

//set controller to provide data to the set page
angular.module("app").controller("setCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
  //set up route parameter variables
  var userid = $routeParams.userid
  var setid = $routeParams.setid
  $scope.userid = $routeParams.userid
  $scope.setid = $routeParams.setid

  //set up path variable
  $scope.path = userid+"/"+setid
  //get set details
  var url = "http://localhost:5000/getsetdetails/setid="+setid
  $http.get(url)
   .then(function(response) {
     $scope.set = response.data
     $scope.flashcards = response.data.cards
     $scope.subjectid = response.data.subjectid
     console.log("here")
     //get subject details
     var url = "http://localhost:5000/getsubjectdetails/subjectid="+response.data.subjectid
     $http.get(url)
      .then(function(response) {
        $scope.subject = response.data
      });

 //initialise learnt variables
 $scope.learnt = 0
 $scope.total = 0

 //iterate through cards
 for (i in $scope.flashcards){
   $scope.total += 1
   //check if learnt and colour and add tick or cross accordingly
   if ($scope.flashcards[i].learnt === 1){
     $scope.learnt += 1
     $scope.flashcards[i].icon = "glyphicon glyphicon-ok icon-success"
     $scope.flashcards[i].bg = "success"
   } else {
     $scope.flashcards[i].icon = "glyphicon glyphicon-remove icon-danger"
     $scope.flashcards[i].bg = "danger"
   }
   //set size of text based on the type of card
   if ($scope.flashcards[i].typeid === 1){
     $scope.flashcards[i].frontsize = "48px"
     $scope.flashcards[i].backsize = "24px"
   }
   else if ($scope.flashcards[i].typeid === 2){
     $scope.flashcards[i].frontsize = "30px"
     $scope.flashcards[i].backsize = "24px"
   }
   else if ($scope.flashcards[i].typeid === 3){
     $scope.flashcards[i].frontsize = "35px"
     $scope.flashcards[i].backsize = "35px"
   }
    if ($scope.flashcards[i].grade === "None"){
      $scope.flashcards[i].gradegrid = ""
    } else {
      $scope.flashcards[i].gradegrid = $scope.flashcards[i].grade
    }
 };

  //calculate percentage
  //avoid devision by 0 error
  if ($scope.total === 0) {
     $scope.percentage = 0
   } else {
   $scope.percentage = Math.floor(($scope.learnt/$scope.total)*100)
  };

 //initialise learning session object, to store the users preferences
 $scope.session = {learnmethod : "0", shuffle : false, unlearntonly : false}

 //start session function to be called when start learning button is pressed
 $scope.startsession = function (sessiondetails) {
   //set up path in following format:
   //"/#/learningtype/userid/setid/shuffleboolean/"
   var path = "/#/"
   if (sessiondetails.learnmethod === "0") {
     path += "manual/"+userid+"/"+setid
   } else if (sessiondetails.learnmethod === "1") {
     path += "multiplechoice/"+userid+"/"+setid
   } else {
     path += "typedanswer/"+userid+"/"+setid
   }

   if (sessiondetails.shuffle) {
    path += "/1"
  } else{
    path += "/0"
  }

  if (sessiondetails.unlearntonly) {
   path += "/1"
 } else{
   path += "/0"
 }


   window.open(path, "_self");
 }
 });

 $scope.editset = function(userid, subjectid, setid){
   console.log("here")
   var url = "http://localhost:5000/getfirstcard/setid="+$scope.setid
   $http.get(url)
    .then(function(response) {
      var firstcardid = response.data
      window.open("/#/editset/"+$scope.userid+"/"+$scope.subjectid+"/"+$scope.setid+"/"+firstcardid, "_self");
    });
 };

 $scope.deleteset = function(setid){
   var url = "http://localhost:5000/deleteset/setid="+setid
   $http.get(url)
   .then(function(response) {
     window.open("/#/start/"+$scope.userid, "_self");
 });
 };

    }]);

angular.module("app").controller("subjectsCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
  var userid = $routeParams.userid;
  $scope.userid = userid
  var url = "http://localhost:5000/getlearntandtotaluser/userid="+userid
  $http.get(url).then(function(response) {

  var url = "http://localhost:5000/getsubjects/userid="+userid+"/"
   $http.get(url).then(function(response) {
     // success
      //console.log(response.data)
      $scope.subjects = response.data
      $scope.overall = {
        learnt : 0, total : 0
      };

      var subjectAmount = $scope.subjects.length;

      for (i = 0; i < subjectAmount; i++){
        if ($scope.subjects[i].total === 0) {
          $scope.subjects[i].percentage = 0
        } else {
        $scope.subjects[i].percentage = Math.floor(($scope.subjects[i].learnt/$scope.subjects[i].total)*100)
      };
        $scope.overall.learnt += $scope.subjects[i].learnt;
        $scope.overall.total += $scope.subjects[i].total;
        $scope.subjects[i].image = "images/subjects/"+$scope.subjects[i].image
      }
      $scope.overall.percentage = Math.floor(($scope.overall.learnt/$scope.overall.total)*100)
      });
      });
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

      $scope.createSubject = function(subjectdetails) {
        //remove path from image name
        subjectdetails.image = subjectdetails.image.replace("images/subjects/","")
        //db query url for create subject url
        var url = "http://localhost:5000/createsubject/userid="+userid+"/name="+subjectdetails.name+"/image="+subjectdetails.image+"/"
        $http.get(url).then(function(response) {
          // on success reload the page to display added set
           window.location.reload()
         });
      };
    }]);



    angular.module("app").controller("multiplechoiceCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {

        var confirmOnPageExit = function (e)
      {
          // If we haven't been passed the event get the window.event
          e = e || window.event;

          var message = 'Any text will block the navigation and display a prompt';

          // For IE6-8 and Firefox prior to version 4
          if (e)
          {
              e.returnValue = message;
          }

          // For Chrome, Safari, IE8+ and Opera 12+
          return message;
      };
      //console.log("im doing somehting")
      window.onbeforeunload = confirmOnPageExit;

        var userid = $routeParams.userid
        $scope.userid = userid

        var setid = $routeParams.setid
        $scope.setid = setid

        var shuffle = $routeParams.shuffle
        var unlearntonly = $routeParams.unlearntonly

        var url = "http://localhost:5000/getlearntandtotal/setid="+setid
        $http.get(url)
         .then(function(response) {
           $scope.total = response.data.total
           $scope.learnt = response.data.learnt
           $scope.percentage = Math.floor($scope.learnt/$scope.total*100)
         });

         //set up API url to get the contents of cards, with parameters of set ID and shuffle and unlearntonly booleans.
        var url = "http://localhost:5000/getcardstolearn/setid="+setid+"/shuffle="+shuffle+"/unlearntonly="+unlearntonly;
        //returns array of objects, one for each card in the following format:
        //{front:"front content", back:"back content", learnt:1/0, grade:"grade of card"}
        $http.get(url)
         .then(function(response) {
           $scope.flashcards = response.data
           var url = "http://localhost:5000/getsetdetails/setid="+setid;
           $http.get(url)
            .then(function(response) {
              //returns details of set in object following format:
              //{name:"set name", "predicted_grade": "current grade based on progress", learnt: number of learnt cards (integer), total: total number of cards (integer), examdate: "date of exam", subjectid: if of subject, setid: id of set}
              $scope.set = response.data
            });
           $scope.flashcards = response.data
           //set first card to active so that it is displayed first
           $scope.flashcards[0].active = "active"
           //convert from sql database boolean to js boolean
           for (i=0; i < $scope.flashcards.length; i++) {
             if ($scope.flashcards[i].learnt === 1) {
               $scope.flashcards[i].learnt = true
             } else {
               $scope.flashcards[i].learnt = false
             }
            }
           //iterate through flashcards
           for (i in $scope.flashcards){
             //randomise position of correct answer
             $scope.flashcards[i].correct = Math.floor((Math.random() * 4))
             //initialise answers array
             $scope.flashcards[i].answers = []
             //initialise colours list set in the following format:
             //(blank) : black
             //selected : blue
             //correct : green
             //incorrect : red
             $scope.flashcards[i].colours = ["", "", "", ""]
             //initialise instruction message
             $scope.flashcards[i].message = "Select Answer"
             //initialise array of ids already used in multiple choice
             var used_array = [parseInt(i)]
             //iterate 4 times to get four random answers
             for (j = 0; j < 4; j++) {
               //initialise already there boolean that is true when the selected answer has alredy been used
               var already_there = true
                while (already_there){
                   //set random number to number between 0 and number of cards
                   //(random float between 0 and 1, multiplied be length of cards and rounded down)
                   var randnum = Math.floor(Math.random() * $scope.flashcards.length)
                   //check if number has been used
                   var found = false
                   for (k in used_array){
                     if (used_array[k] === randnum) {
                       found = true
                     }
                   }
                   //set already there to result of already there
                  already_there = found
                }
               // add number to used array
               used_array.push(randnum)
               //add answer to list of answers
               $scope.flashcards[i].answers.push($scope.flashcards[randnum].back)
             }
             //add correct answer in position of correct answer
             $scope.flashcards[i].answers[$scope.flashcards[i].correct] = $scope.flashcards[i].back

             //initialise cards remaining variable to number of cards
             $scope.cardsremaining = $scope.flashcards.length
            };
           });

           //next card function
           $scope.next = function(){
             //hide next card button
             $("#righticon").removeClass("glyphicon-chevron-right");
             $("#rightbutton").removeClass("right");
           }

           //function to be called when answer selected
           $scope.select = function(selectedanswer, index){
             //hide submit button
             $("#submitbutton").removeClass("hidden");
             //clear colours
             $scope.flashcards[index].colours = ["", "", "", ""]
             //set selected answer to blue
             $scope.flashcards[index].colours[selectedanswer] = "selected"
             //clear message
             $scope.flashcards[index].message = ""
             //show submit button
             $("#submitbutton"+index).removeClass("hidden");
           }

           //function to be called to submit answer
           $scope.submit = function(selectedanswer, correctanswer, index){
             //show next button
             $("#righticon").addClass("glyphicon-chevron-right");
             $("#rightbutton").addClass("right");

             //hide submit button
             $("#submitbutton"+index).addClass("hidden");

             $scope.cardsremaining -= 1
             //set colour to green
             $scope.flashcards[index].colours[correctanswer] = "correct"

             //check if correct
             selectedanswer = parseInt(selectedanswer)
             if (selectedanswer === correctanswer){
               //update message and variables
               $scope.flashcards[index].message = "Correct!"
               $scope.correct += 1
               $scope.correctpercentage = ($scope.correct/$scope.flashcards.length)*100
               //change learnt to true
               var url = "http://localhost:5000/changelearnt/flashcardid="+$scope.flashcards[index].flashcardid+"/learnt=true"
               $http.get(url)
             }
             else{
               //update variables and message
               $scope.incorrect += 1
               $scope.incorrectpercentage = ($scope.incorrect/$scope.flashcards.length)*100
               $scope.flashcards[index].colours[selectedanswer] = "incorrect"
               $scope.flashcards[index].message = "Incorrect"
               //change learnt to false
               var url = "http://localhost:5000/changelearnt/flashcardid="+$scope.flashcards[index].flashcardid+"/learnt=false"
               $http.get(url)
             }
           }
        //initialise variables
        $scope.correct = 0
        $scope.incorrect = 0

        //get set details
        var url = "http://localhost:5000/getsetdetails/setid="+$routeParams.setid
        $http.get(url).then(function(response) {
          $scope.set = response.data
        });


        }]);

//summary controller to provide data for the summary page
angular.module("app").controller("summaryCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
  //set route parameter variables
  $scope.setid = $routeParams.setid
  var setid = $routeParams.setid
  $scope.userid = $routeParams.userid
  var userid = $routeParams.userid
  //get learnt and total cards
  var url = "http://localhost:5000/getlearntandtotal/setid="+$routeParams.setid
  $http.get(url).then(function(response) {
    //get set details
    var url = "http://localhost:5000/getsetdetails/setid="+$routeParams.setid
    $http.get(url).then(function(response) {
      $scope.set = response.data
      $scope.set.percentage = Math.floor($scope.set.learnt/$scope.set.total*100)
      $scope.set.unlearnt = $scope.set.total - $scope.set.learnt
      var url = "http://localhost:5000/getsubjectdetails/subjectid="+$scope.set.subjectid
      $http.get(url).then(function(response) {
        $scope.subject = response.data
      });
    });
  });
  //initialse session object
  $scope.session = {learnmethod : "0", shuffle : false, unlearntonly : false}
  //start session function to be called when start learning button is pressed
  $scope.startsession = function (sessiondetails) {
    //set up path in following format:
    //"/#/learningtype/userid/setid/shuffleboolean/"
    var path = "/#/"
    if (sessiondetails.learnmethod === "0") {
      path += "manual/"+userid+"/"+setid
    } else if (sessiondetails.learnmethod === "1") {
      path += "multiplechoice/"+userid+"/"+setid
    } else {
      path += "typedanswer/"+userid+"/"+setid
    }

    if (sessiondetails.shuffle) {
     path += "/1"
   } else{
     path += "/0"
   }

   if (sessiondetails.unlearntonly) {
    path += "/1"
  } else{
    path += "/0"
  }
    window.open(path, "_self");
  }

  }]);

//sets controller to provide data and services to sets page
angular.module("app").controller("setsCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
  $scope.userid = $routeParams.userid

  //get subject details
  var url = "http://localhost:5000/getsubjectdetails/subjectid="+$routeParams.subjectid
  $http.get(url).then(function(response) {
    $scope.subject = response.data

  });
  $scope.userid = $routeParams.userid

  //set up sort function to sort sets
  //the following function takes an array of objects and sorts it by a particular field - will be used to sort by name or percentage
  var sort_by = function(field, reverse, primer){

  var key = primer ?
       function(x) {return primer(x[field])} :
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
      }
    }

    //sort by date function
    sort_by_date = function(a,b) {
      return new Date(a.examdate).getTime() - new Date(b.examdate).getTime()
    };

  //update set function
  $scope.updatesort = function(sortbynum){
    if (sortbynum === "0") {
      $scope.sets = $scope.sets.sort(sort_by('name', false, function(a){return a.toUpperCase()}));
    }
    else if (sortbynum === "1") {
      $scope.sets.sort(sort_by_date);
    }
    else{
        $scope.sets = $scope.sets.sort(sort_by('percentage', false, parseInt));
    }


  }
  var subjectid = $routeParams.subjectid;

  //initialse sort by to sort by name
  $scope.sortby = "0";

  //get sets API
  var url = "http://localhost:5000/getsets/subjectid="+subjectid+"/"
   $http.get(url).then(function(response) {
      //returns an array of objects with details of each sets
      $scope.sets = response.data
      $scope.updatesort($scope.sortby)
      $scope.overall = {
      learnt : 0, total : 0
    };

    var setAmount = $scope.sets.length;

    for (i = 0; i < setAmount; i++){

      if ($scope.sets[i].total === "0"){
        $scope.sets[i].percentage = 0
      }
      else {
      $scope.sets[i].percentage = Math.floor((parseInt($scope.sets[i].learnt)/parseInt($scope.sets[i].total))*100)
      }
      $scope.overall.learnt += parseInt($scope.sets[i].learnt);
      $scope.overall.total += parseInt($scope.sets[i].total);

    $scope.setAmount = setAmount

    $scope.overall.percentage = Math.floor(($scope.overall.learnt/$scope.overall.total)*100)
  };
  });

}]);
