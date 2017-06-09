
var app = angular.module("datalist", ['LocalStorageModule']);

app.factory('datastore', function ($http) {
    var detaildata = [];
    var slist = function () {
        return $http.get('/studentlists');
    };
    var ilist = function () {
        return $http.get('/instructorlist');
    };
    return {
        slist: slist,
        ilist: ilist
    }
});

// Student section
app.controller('student', ['$scope', '$http', 'datastore', '$window', 'localStorageService', function ($scope, $http, datastore,$window, localStorageService) {
    $scope.slist = [];
    $scope.detail = [];
    $scope.shared = [];
 
    datastore.slist().then(function (result) {
        $scope.slist = result.data.results;        
        localStorageService.set("slist", result.data.results);
    });
    $scope.delete = function (id) {
        var student = $scope.slist[id];        
        $http({
            url: '/delete',
            method: 'POST',
            dataType: 'JSON',
            data: { '_id': student._id, 'category': 'student'}
        }).then(function mySucces(response) {
            console.log('data deleted');
            $window.location.href = '/student';
        }, function myError(err) {
            console.log(err);
        });
    }
    $scope.detail = function (dataid) {
        var student = $scope.slist[dataid];
        $http({
            url: '/detail',
            method: 'POST',
            dataType: 'JSON',
            data: { 'name': student.name, 'age': student.age}
        }).then(function mySucces(response) {
            console.log('data received');
            localStorageService.set("detaildata", response.data.detail);
            var data = response.data.detail;
            $window.location.href = '/detail';
        }, function myError(err) {
            console.log(err);
        });
        // $scope.$apply();
    }
}]);
app.controller('detail', ['$scope', '$http', 'datastore', '$window', 'localStorageService', function ($scope, $http, $window, datastore,localStorageService) {
    $scope.details = localStorageService.get("detaildata");
    $scope.all = localStorageService.get("slist");
    //console.log($scope.details);
    $scope.edit = function (dataid) {        
        //var studentdata = $scope.editlist[dataid];
        //console.log($scope.all);
        var studentdata = $scope.all;
        for (var i = 0; i < studentdata.length; i++) {
            if ($scope.all[i]._id == dataid) {
                var student = $scope.all[i]; 
            }
        }
        console.log(student);
        localStorageService.set("editdata", student);
        //console.log(data);
        window.location.href = '/edit';        
    }
}]);
app.controller('edit', ['$scope', '$http', 'datastore', '$window', 'localStorageService', function ($scope, $http, $window, datastore, localStorageService) {
    $scope.edits = localStorageService.get("editdata");   
    $scope.button = function () {
        console.log($scope.edits);
    }
}]);

//Course section----------------------------------------------------------------------------------------------
app.controller('course', ['$scope', '$http', 'datastore', '$window', 'localStorageService', function ($scope, $http, $window, datastore, localStorageService) {
    //$scope.edits = localStorageService.get("editdata");
    $http.get('/courselist').then(function (result) {
        $scope.clist = result.data.results;
    });
    $scope.delete = function (id) {
        var course = $scope.clist[id];
        $http({
            url: '/delete',
            method: 'POST',
            dataType: 'JSON',
            data: { '_id': course._id, 'category': 'course' }
        }).then(function mySucces(response) {
            console.log('data deleted');
            window.location.href = '/course';
        }, function myError(err) {
            console.log(err);
        });
    }
    $scope.detail_course = function (dataid) {
        var course = $scope.clist[dataid];
        $http({
            url: '/detailcourse',
            method: 'POST',
            dataType: 'JSON',
            data: { 'coursename': course.coursename, 'coursenumber': course.coursenumber }
        }).then(function mySucces(response) {
            console.log('data received');
            localStorageService.set("coursedetail", response.data.detail);
            var data = response.data.detail;
            //console.log(data);
            window.location.href = '/detail_course';
        }, function myError(err) {
            console.log(err);
        });
        // $scope.$apply();
    }

}]);

app.controller('detail_course', ['$scope', '$http', 'datastore', '$window', 'localStorageService', function ($scope, $http, $window, datastore, localStorageService) {
    $scope.coursedetail = localStorageService.get("coursedetail");

    $scope.edit = function (dataid) {
        var courses = $scope.coursedetail;
        for (var i = 0; i < courses.length; i++) {
            if ($scope.coursedetail[i]._id == dataid) {
                var course = $scope.coursedetail[i];
            }
        }
        console.log(course);
        localStorageService.set("editcourse", course);
        //console.log(data);
        window.location.href = '/edit_course';
    }
    $scope.adding = function () {
        console.log('Moving to the page');
        window.location.href = '/add_student';
    }
}]);
app.controller('edit_course', ['$scope', '$http', 'datastore', '$window', 'localStorageService', function ($scope, $http, $window, datastore, localStorageService) {
    $scope.edit_cour = localStorageService.get("editcourse");
}]);
app.controller('newcourse', ['$scope', '$http', 'datastore', '$window', 'localStorageService', function ($scope, $http, $window, datastore, localStorageService) {
    $http.get('/instructorlist').then(function (result) {
        $scope.dropdown = result.data.results;
    });
}]);


//Instructor section ----------------------------------------------------------------------------------------
app.controller('instructor', ['$scope', '$http', 'datastore', '$window', 'localStorageService', function ($scope, $http, $window, datastore,localStorageService) {
    $http.get('/instructorlist').then(function (result) {
        $scope.ilists = result.data.results;
        localStorageService.set("ilist", result.data.results);
    });
    $scope.editBoolean = false;
    $scope.clicked = function (id) {       
        $http({
            url: '/courselist',
            method: 'POST',
            dataType: 'JSON',
            data: { 'id': id }
        }).then(function mySucces(response) {
            console.log('data received');
            $scope.selectedstudents = result.data.course;           
        }, function myError(err) {
            console.log(err);
        });
        $scope.editBoolean = true;
    }
    $scope.delete = function (id) {
        var instructor = $scope.ilists[id];
        $http({
            url: '/delete',
            method: 'POST',
            dataType: 'JSON',
            data: { '_id': instructor._id, 'category': 'instructor' }
        }).then(function mySucces(response) {
            console.log('data deleted');
            window.location.href = '/instructor';
        }, function myError(err) {
            console.log(err);
        });
    }
    $scope.detail_instructor = function (dataid) {
        var instructor = $scope.ilists[dataid];
        $http({
            url: '/detail_instructor',
            method: 'POST',
            dataType: 'JSON',
            data: { 'name': instructor.name, 'age': instructor.age}
        }).then(function mySucces(response) {
            console.log('data received');
            localStorageService.set("detail_instructor", response.data.detail);
            var data = response.data.detail;
            //console.log(data);
            window.location.href = '/detail_instructor';
        }, function myError(err) {
            console.log(err);
        });
        // $scope.$apply();
    }
}]);
app.controller('detail_instructor', ['$scope', '$http', 'datastore', '$window', 'localStorageService', function ($scope, $http, $window, datastore, localStorageService) {
    $scope.instructordetail = localStorageService.get("detail_instructor");
    $scope.edit = function (dataid) {
        //var studentdata = $scope.editlist[dataid];
        //console.log($scope.all);
        var instructordata = $scope.instructordetail;
        for (var i = 0; i < instructordata.length; i++) {
            if ($scope.instructordetail[i]._id == dataid) {
                var instructor = $scope.instructordetail[i];
            }
        }
        console.log(instructor);
        localStorageService.set("editinstructor", instructor);
        //console.log(data);
        window.location.href = '/edit_instructor';
    }
}]);
app.controller('edit_instructor', ['$scope', '$http', 'datastore', '$window', 'localStorageService', function ($scope, $http, $window, datastore, localStorageService) {
    $scope.edit_ins = localStorageService.get("editinstructor");
}]);



//directive section ----------------------------------------------------------------------

app.directive('ngConfirmClick', [
    function () {
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click', function (event) {
                    if (window.confirm(msg)) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
    }])
app.directive('myCustomer', function () {
    return {
        templateUrl: '/instructortemplate'
    };
});
app.directive('elastic', [
    '$timeout',
    function ($timeout) {
        return {
            restrict: 'A',
            scope: {
                ngShow: "="
            },
            link: function ($scope, element, attr) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                var resize = function () {
                    element[0].style.height = $scope.initialHeight;
                    element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                if (attr.hasOwnProperty("ngShow")) {
                    function ngShow() {
                        if ($scope.ngShow === true) {
                            $timeout(resize, 0);
                        }
                    }
                    $scope.$watch("ngShow", ngShow);
                    setTimeout(ngShow, 0);
                }
                element.on("input change", resize);
                $timeout(resize, 0);
            }
        };
    }
]);
app.directive("edit", function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            eventHandler: '&ngClick'
        },
        template: '<div id="holder"><button type="button" data-ng-click="eventHandler()">Edit</button></div>'
    };
});