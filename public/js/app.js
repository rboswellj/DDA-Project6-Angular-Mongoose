var app = angular.module('studentsApp', ['ngRoute']);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/all_students.html', // route for the home page
      controller: 'allCtrl',
    })
    .when('/all_students', {
      templateUrl: 'partials/all_students.html',
      controller: 'allCtrl',
    })
    .when('/add_student', {
      templateUrl: 'partials/add_student.html', // add a student to db
      controller: 'addCtrl',
    })
    .when('/edit_students', {
      templateUrl: 'partials/edit_students.html', // edit a student record
      controller: 'editCtrl',
    })
    .otherwise({
      redirectTo: 'partials/all_students.html', // any other URL goes to home
    });
});

/*   a controller for each page  */
app.controller('allCtrl', function ($scope, $http) {
  $http
    .get('/showAll') // get all the students
    .then(function (response) {
      $scope.students = response.data;
    });
});

app.controller('addCtrl', function ($scope, $http) {
  $scope.addRecord = function () {
    // add a student
    rnd_id = Math.floor(Math.random() * 1000) + 100; // random 3-digit student id > 100

    var info = {
      sid: rnd_id, // set up data object
      first_name: $scope.first_name,
      last_name: $scope.last_name,
      midterm: $scope.midterm,
      final: $scope.final,
      major: $scope.major,
    };

    url = '/addStudent';

    $http
      .post(url, info) // post the object data
      .then(function (response) {
        $scope.status = response.data; //print status of request

        // clear textboxes
        $scope.first_name = '';
        $scope.last_name = '';
        $scope.midterm = '';
        $scope.final = '';
        $scope.major = '';
      });
  };
});

app.controller('editCtrl', function ($scope, $http) {
  // edit midterm or final of record

  // start with the first student object in the array of students
  $scope.studentIndex = 0; // array index of a particular student object

  $http.get('/showAll').then(function (response) {
    $scope.students = response.data;
    $scope.student = $scope.students[$scope.studentIndex];
    $scope.maxIndex = $scope.students.length - 1; // index of last student object
  });

  $scope.nextRecord = function () {
    $scope.studentIndex += 1; // go to next student object
    if ($scope.studentIndex > $scope.maxIndex)
      $scope.studentIndex = $scope.maxIndex;

    $scope.student = $scope.students[$scope.studentIndex];
  };

  $scope.previousRecord = function () {
    $scope.studentIndex -= 1; // go to previous student index
    if ($scope.studentIndex < 0) $scope.studentIndex = 0;

    $scope.student = $scope.students[$scope.studentIndex];
  };

  $scope.updateRecord = function () {
    var student = $scope.students[$scope.studentIndex];

    if (
      parseInt(student.sid) &&
      parseInt(student.midterm) &&
      parseInt(student.final)
    ) {
      var info = {
        sid: student.sid,
        midterm: student.midterm,
        final: student.final,
      };
      try {
        url = '/updateStudent';
        $http.post(url, info).then(function (response) {
          $scope.student = $scope.students[$scope.studentIndex];
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      alert('Invalid change');
    }
  };

  $scope.deleteRecord = function () {
    var sid = $scope.students[$scope.studentIndex].sid;

    url = '/deleteStudent?sid=' + sid; // concat for get request
    //console.log(url)
    $http.get(url).then(function (response) {
      //$scope.student = response.data;
      console.log($scope.student);
      $scope.maxIndex = $scope.students.length - 1;
      $scope.student = $scope.students[$scope.studentIndex];
      alert('Student Deleted');
    });
    if($scope.studentIndex < $scope.students.length - 1){
        $scope.nextRecord();
    } else {
        $scope.previousRecord();
    }
  };
});
