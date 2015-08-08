angular.module("app", []);

angular.module("app").controller("PersonnelController", function($scope){
  $scope.people = [
    {name: "Ben", job: "Student"},
    {name: "Asher", job: "Front End Developer"},
    {name: "Andy", job: "Front End Developer"},
    {name: "Phil", job: "Back End Developer"},
    {name: "Mark", job: "Back End Developer"},
    {name: "Scott", job: "Manager"},
    {name: "Kathryn", job: "Product Owner"}
  ];
  console.log($scope.people);
  $scope.addPerson = function(person) {
    $scope.people.push({name: $scope.person.fname, job: $scope.person.job});
    $scope.person = {};
    $scope.personnelForm.$setPristine();
    $scope.personnelForm.$setUntouched();
  };
  $scope.removePerson = function(id){
    $scope.people.splice(id, 1);
  }
  $scope.editPerson = function(id){
    console.log($scope.people[id], id);
    console.log($scope.personnelForm);
    $scope.person.fname = "Paul";
    $scope.person.job   = "Support";
  }
});
