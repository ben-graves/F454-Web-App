var app = angular.module("app", [
  'ngRoute']).
  config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/', {templateUrl : 'partials/index.html', controller: "welcomeCtrl"});
      $routeProvider.when('/start/:userid', {templateUrl : 'partials/start.html', controller: "startCtrl"});
      $routeProvider.when('/newset/:userid', {templateUrl : 'partials/newset.html', controller: "newsetCtrl"});
      $routeProvider.when('/editset/:userid/:subjectid/:setid/:flashcardid', {templateUrl : 'partials/editset.html', controller: "editsetCtrl"});
      $routeProvider.when('/subjects/:userid', {templateUrl : 'partials/subjects.html', controller: "subjectsCtrl"});
      $routeProvider.when('/sets/:userid/:subjectid', {templateUrl : 'partials/sets.html', controller: "setsCtrl"});
      $routeProvider.when('/set/grid/:setid', {templateUrl : 'partials/setgrid.html', controller: "setCtrl"});
      $routeProvider.when('/set/list/:setid', {templateUrl : 'partials/setlist.html', controller: "setCtrl"});
      $routeProvider.when('/manual/:setid', {templateUrl : 'partials/manual.html', controller: "manualCtrl"});
      $routeProvider.when('/multiplechoice/:setid', {templateUrl : 'partials/multiplechoice.html', controller: "multiplechoiceCtrl"});
      $routeProvider.when('/typedanswer/:setid', {templateUrl : 'partials/typedanswer.html', controller: "typedanswerCtrl"});
      $routeProvider.otherwise({templateUrl : 'partials/notfound.html'});
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

angular.module("app").controller("manualCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
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
    {front:"to fix/repair", back:"arreglar", learnt : "false"},
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

$scope.flashcards[0].active = "active"

    }]);

    angular.module("app").controller("typedanswerCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
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
        {front:"to fix/repair", back:"arreglar", learnt : "false"},
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

    $scope.flashcards[0].active = "active"

        }]);

angular.module("app").controller("startCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
  var userid = $routeParams.userid;
  $scope.userid = userid
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
  $scope.autoDefine =  function(front, type) {
      if (type === "0"){
          $scope.select = function(selected){
            $('#flashcardback').val($('#flashcardback').val() + selected+'\n');
          };
        $scope.definitions_title = "Searching Dictionairy..."
        $scope.wikipedia_title = "Searching Wikipedia..."
        $scope.articles = []
        $scope.definitons = []
        $('#autoDefine').modal({
            show: 'true'
          });
        var url = "http://localhost:5001/definitions/term="+front+"/"
         $http.get(url)
          .then(function(response) {
            $scope.definitions = response.data
            $scope.definitions_title = $scope.definitions.length+" Definitions Found"
            $scope.firstResult = $scope.definitions[0]
            $scope.selected = {}
            $scope.selected.text = $scope.firstResult
            var url = "http://localhost:5001/titleandarticle/term="+front+"/"
            $http.get(url)
             .then(function(response) {
               $scope.articles = response.data
               $scope.wikipedia_title = $scope.articles.length+" Wikipedia Articles Found"
             });
            /*$scope.getDefinition =  function(define) {
              var term = define.term
              var sentences = define.sentences
              /*if (term === undefined){
                term = defaultval
              }
              var url_def = "http://localhost:5001/define/term="+term+"/sentences="+sentences
               $http.get(url_def)
                .then(function(response) {
                  console.log(response.data)
                var defined_data = response.data
                  $('#flashcardback').val($('#flashcardback').val() + defined_data+'\n');
                  console.log("aqui")});

                };*/

          });
        }
        else if (type === "1") {
          $('#searchPrompt').modal({
              show: 'true'
            });
        }
        else if (type === "2") {
          $scope.toplanguages = [{'name': 'English', 'code': 'en'}, {'name': 'French', 'code': 'fr'}, {'name': 'Spanish', 'code': 'es'}, {'name': 'German', 'code': 'de'},{'name': 'Chinese', 'code': 'zh'}]
          $scope.alllanguages = [{'name': 'Afrikaans', 'code': 'af'}, {'name': 'Albanian', 'code': 'sq'}, {'name': 'Arabic', 'code': 'ar'}, {'name': 'Armenian', 'code': 'hy'}, {'name': 'Azerbaijani', 'code': 'az'}, {'name': 'Basque', 'code': 'eu'}, {'name': 'Belarusian', 'code': 'be'}, {'name': 'Bengali', 'code': 'bn'}, {'name': 'Bosnian', 'code': 'bs'}, {'name': 'Bulgarian', 'code': 'bg'}, {'name': 'Catalan', 'code': 'ca'}, {'name': 'Cebuano', 'code': 'ceb'}, {'name': 'Chichewa', 'code': 'ny'}, {'name': 'Chinese', 'code': 'zh'}, {'name': 'Chinese (Simplified)', 'code': 'zh-CN'}, {'name': 'Chinese (Traditional)', 'code': 'zh-TW'}, {'name': 'Croatian', 'code': 'hr'}, {'name': 'Czech', 'code': 'cs'}, {'name': 'Danish', 'code': 'da'}, {'name': 'Dutch', 'code': 'nl'}, {'name': 'English', 'code': 'en'}, {'name': 'Esperanto', 'code': 'eo'}, {'name': 'Estonian', 'code': 'et'}, {'name': 'Filipino', 'code': 'tl'}, {'name': 'Finnish', 'code': 'fi'}, {'name': 'French', 'code': 'fr'}, {'name': 'Galician', 'code': 'gl'}, {'name': 'Georgian', 'code': 'ka'}, {'name': 'German', 'code': 'de'}, {'name': 'Greek', 'code': 'el'}, {'name': 'Gujarati', 'code': 'gu'}, {'name': 'Haitian Creole', 'code': 'ht'}, {'name': 'Hausa', 'code': 'ha'}, {'name': 'Hebrew', 'code': 'iw'}, {'name': 'Hindi', 'code': 'hi'}, {'name': 'Hmong', 'code': 'hmn'}, {'name': 'Hungarian', 'code': 'hu'}, {'name': 'Icelandic', 'code': 'is'}, {'name': 'Igbo', 'code': 'ig'}, {'name': 'Indonesian', 'code': 'id'}, {'name': 'Irish', 'code': 'ga'}, {'name': 'Italian', 'code': 'it'}, {'name': 'Japanese', 'code': 'ja'}, {'name': 'Javanese', 'code': 'jw'}, {'name': 'Kannada', 'code': 'kn'}, {'name': 'Kazakh', 'code': 'kk'}, {'name': 'Khmer', 'code': 'km'}, {'name': 'Korean', 'code': 'ko'}, {'name': 'Lao', 'code': 'lo'}, {'name': 'Latin', 'code': 'la'}, {'name': 'Latvian', 'code': 'lv'}, {'name': 'Lithuanian', 'code': 'lt'}, {'name': 'Macedonian', 'code': 'mk'}, {'name': 'Malagasy', 'code': 'mg'}, {'name': 'Malay', 'code': 'ms'}, {'name': 'Malayalam', 'code': 'ml'}, {'name': 'Maltese', 'code': 'mt'}, {'name': 'Maori', 'code': 'mi'}, {'name': 'Marathi', 'code': 'mr'}, {'name': 'Mongolian', 'code': 'mn'}, {'name': 'Myanmar (Burmese)', 'code': 'my'}, {'name': 'Nepali', 'code': 'ne'}, {'name': 'Norwegian', 'code': 'no'}, {'name': 'Persian', 'code': 'fa'}, {'name': 'Polish', 'code': 'pl'}, {'name': 'Portuguese', 'code': 'pt'}, {'name': 'Punjabi', 'code': 'pa'}, {'name': 'Romanian', 'code': 'ro'}, {'name': 'Russian', 'code': 'ru'}, {'name': 'Serbian', 'code': 'sr'}, {'name': 'Sesotho', 'code': 'st'}, {'name': 'Sinhala', 'code': 'si'}, {'name': 'Slovak', 'code': 'sk'}, {'name': 'Slovenian', 'code': 'sl'}, {'name': 'Somali', 'code': 'so'}, {'name': 'Spanish', 'code': 'es'}, {'name': 'Sundanese', 'code': 'su'}, {'name': 'Swahili', 'code': 'sw'}, {'name': 'Swedish', 'code': 'sv'}, {'name': 'Tajik', 'code': 'tg'}, {'name': 'Tamil', 'code': 'ta'}, {'name': 'Telugu', 'code': 'te'}, {'name': 'Thai', 'code': 'th'}, {'name': 'Turkish', 'code': 'tr'}, {'name': 'Ukrainian', 'code': 'uk'}, {'name': 'Urdu', 'code': 'ur'}, {'name': 'Uzbek', 'code': 'uz'}, {'name': 'Vietnamese', 'code': 'vi'}, {'name': 'Welsh', 'code': 'cy'}, {'name': 'Yiddish', 'code': 'yi'}, {'name': 'Yoruba', 'code': 'yo'}, {'name': 'Zulu', 'code': 'zu'}]
          $scope.translate = function (langfrom, langto) {
            var url = "http://localhost:5001/translate/term="+front+"/langfrom="+langfrom+"/langto="+langto+"/"
            $http.get(url)
             .then(function(response) {
               $('#flashcardback').val($('#flashcardback').val() + response.data+'\n');
             });
          }
          $('#autoTranslate').modal({
              show: 'true'
            });

        }
        else  {
          $('#errorBox').modal({
              show: 'true'
            });
        }

      }


  $scope.search = function(front) {
    var url = "https://www.google.co.uk/#q="+front.replace(" ","+")
    window.open(url, '_blank').focus();
  };
    }]);

angular.module("app").controller("setCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {



  $scope.set = {name : "Essential Verbs",
                subject : "Spanish"};
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
    {front:"to fix/repair", back:"arreglar", learnt : "false"},
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

 var size_list = ["50px", "40px", "33px", "25px", "20px"]
 var max_list = [18, 22, 40, 54, 108]

 $scope.learnt = 0
 $scope.total = 0

 for (i in $scope.flashcards){
   $scope.total += 1
   if ($scope.flashcards[i].learnt === "true"){
     $scope.learnt += 1
     $scope.flashcards[i].icon = "glyphicon glyphicon-ok icon-success"
     $scope.flashcards[i].bg = "success"
   } else {
     $scope.flashcards[i].icon = "glyphicon glyphicon-remove icon-danger"
     $scope.flashcards[i].bg = "danger"
   }
   var idx = 0
   while (max_list[idx] < $scope.flashcards[i].front.length){
     idx += 1
   }
    $scope.flashcards[i].frontsize = size_list[idx]
    var idx = 0
    while (max_list[idx] < $scope.flashcards[i].back.length){
      idx += 1
    }
     $scope.flashcards[i].backsize = size_list[idx]
 };
 $scope.percentage = Math.floor($scope.learnt/$scope.total*100)

    }]);

angular.module("app").controller("subjectsCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
  /*$scope.subjects = [
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
  ];*/

  var userid = $routeParams.userid;
  $scope.userid = userid
  var url = "http://localhost:5000/getsubjects/userid="+userid+"/"
   $http.get(url).then(function(response) {
     // success
      console.log(response.data)
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
        subjectdetails.image = subjectdetails.image.replace("images/subjects/","")
        var url = "http://localhost:5000/createsubject/userid="+userid+"/name="+subjectdetails.name+"/image="+subjectdetails.image+"/"
        $http.get(url).then(function(response) {
          // success
           console.log(response.data)
           window.location.reload()
         });

      };
    }]);

    angular.module("app").controller("multiplechoiceCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
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
        {front:"to fix/repair", back:"arreglar", learnt : "false"},
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
      $scope.flashcards[i].correct = Math.floor((Math.random() * 4) + 1)
      $scope.flashcards[i].answers = []
      for (j = 0; j < 4; j++) {
        var randnum = Math.floor(Math.random() * $scope.flashcards.length)
        $scope.flashcards[i].answers.push($scope.flashcards[randnum].back)
      }
      $scope.flashcards[i].answers[$scope.flashcards[i].correct] = $scope.flashcards[i].back
      console.log($scope.flashcards[i])
    };

    $scope.flashcards[0].active = "active"
    $scope.correct = 0
    $scope.incorrect = 0
        }]);

angular.module("app").controller("setsCtrl",['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
  $scope.subject = "Computing"
  /*$scope.sets = [
    {id: "1", name : "Chapter 1", image : "images/subjects/Computing.png", learnt : 234, total : 323},
    {id: "2", name : "Chapter 2", image : "images/subjects/Computing.png", learnt : 146, total :147},
    {id: "3", name : "Chapter 3", image : "images/subjects/Computing.png", learnt : 12, total : 286},
    {id: "4", name : "Chapter 4", image : "images/subjects/Computing.png", learnt : 198, total : 243},
    {id: "5", name : "Chapter 5", image : "images/subjects/Computing.png", learnt : 23, total : 53},
  ];*/
  $scope.userid = $routeParams.userid
  var sort_by = function(field, reverse, primer){

   var key = primer ?
       function(x) {return primer(x[field])} :
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
      }
    }

    sort_by_date = function(a,b) {
      return new Date(a.examdate).getTime() - new Date(b.examdate).getTime()
    };

  $scope.updatesort = function(sortbynum){
      console.log(sortbynum)
    if (sortbynum === "0") {
      console.log("0")
      $scope.sets = $scope.sets.sort(sort_by('name', false, function(a){return a.toUpperCase()}));


    }
    else if (sortbynum === "1") {
    console.log("1")
      $scope.sets.sort(sort_by_date);
      console.log($scope.sets[0])
    }
    else{

        console.log("2")
        $scope.sets = $scope.sets.sort(sort_by('percentage', false, parseInt));

    }


  }
  var subjectid = $routeParams.subjectid;

  $scope.sortby = "0";

  var url = "http://localhost:5000/getsets/subjectid="+subjectid+"/"
   $http.get(url).then(function(response) {
     // success
      console.log(response.data)
      $scope.sets = response.data
    $scope.overall = {
      learnt : 0, total : 0
    };

    var setAmount = $scope.sets.length;

    var grades_array = ["U","U", "U", "F", "E", "D", "C", "B", "A", "A*", "A*"];

    for (i = 0; i < setAmount; i++){
      $scope.sets[i].percentage = Math.floor((parseInt($scope.sets[i].learnt)/parseInt($scope.sets[i].total))*100)
      $scope.overall.learnt += parseInt($scope.sets[i].learnt);
      $scope.overall.total += parseInt($scope.sets[i].total);
      $scope.sets[i].grade = grades_array[parseInt($scope.sets[i].percentage/10)]
    }

    $scope.setAmount = setAmount

    $scope.overall.percentage = Math.floor(($scope.overall.learnt/$scope.overall.total)*100)
  });
    }]);
