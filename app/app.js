/* NG APP */
var app = angular.module('formApp', ['ngAnimate', 'ui.router','blockUI']);

/********************************************************************
* ROUTES/VIEWS
********************************************************************/
app.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
    
        /* MAIN FORM ROUTE */
        .state('form', {
            url: '/form',
            templateUrl: 'views/form.html',
            controller: 'formController'
        })
        
        /* NESTED PROFILE ROUTE */
        .state('form.profile', {
            url: '/profile',
            templateUrl: 'views/form-profile.html',
            controller: 'profileController'
        })
        
        /* NESTED CLASS ROUTE */
        .state('form.class', {
            url: '/class',
            templateUrl: 'views/form-class.html',
            controller: 'classController'
        })
        
        /* NESTED CONFIRM ROUTE */
        .state('form.confirm', {
            url: '/confirm',
            templateUrl: 'views/form-confirm.html'
        })

        /* NESTED CONFIRM ROUTE */
        .state('form.success', {
            url: '/success',
            templateUrl: 'views/form-success.html',
            controller: 'successController'
        })

        /* NESTED CONFIRM ROUTE */
        .state('form.error', {
            url: '/error',
            templateUrl: 'views/form-error.html',
            controller: 'errorController'
        });    
    /* CATCH ALL ROUTE */
    $urlRouterProvider.otherwise('/form/profile');
});

/********************************************************************
* CONTROLLERS
********************************************************************/

/* MAIN FORM CONTROLLER*/
app.controller('formController', function($scope,$http,$state,blockUI) {
    $scope.formData = {};
    
    /* FUNCTION TO PROCESS FORM */
    $scope.processForm = function(isValid) {
        console.log($scope.formData);
        blockUI.start();
        $http({
            method: 'POST',
            url: 'http://localhost:8081/api/process',
            data: $scope.formData
        }).success(function (result) {
            if (result === 'success'){
                blockUI.stop();
                $state.go('form.success');
            } else {
                blockUI.stop();
                alert('There was an error processing the form. Please try again');
                $state.go('form.error');
            }
        });


    }; 
});

/* PROFILE CONTROLLER*/
app.controller('profileController',function($scope,$http,$state){
    $scope.PHONE_REGEX = /^[\(\)\s\-\+\d]{10,17}$/;
    $scope.STATE_REGEX = /^(?:A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])*$/i;
    $scope.ZIPCODE_REGEX = /^[0-9]{5}(?:-[0-9]{4})?$/;

    $scope.validate = function() {
        var fields = [
            $scope.userForm.username,
            $scope.userForm.company,
            $scope.userForm.email,
            $scope.userForm.phoneno,
            $scope.userForm.address,
            $scope.userForm.city,
            $scope.userForm.state,
            $scope.userForm.zipcode
        ];
        var invalid = 0;
        angular.forEach(fields,function(value,index){
            if (value.$invalid) {
                invalid = 1;
            }
        });
        if (invalid === 0) {
            $state.go('form.class');
        } else {
            alert('Please verify form is complete');
        }
    };
});

/* CLASS SELECTION CONTROLLER */
app.controller('classController',function($scope,$http,$state){
    
    $scope.selectedClass = '';
    $scope.selectedDateTime = '';
    $scope.upcomingTraining = [];

    /* GET CURRENT CLASS NAMES */
    $http({
        method: 'GET',
        url: 'http://localhost:8081/api/currentclasses',
        data: {}
    }).success(function (result) {
        $scope.upcomingTraining = result;
    });

    /* SELECTED CLASS DROP DOWN HOOK */
    $scope.Selected = function() {

    }
    $scope.$watch('formData.selectedClass', function(newvalue,oldvalue) {
        $scope.formData.selectedDateTime = '';

        if(newvalue !== undefined) {
            $scope.selectedClass = newvalue;
            getDateTimes(newvalue);
        }
    });

    /* POST SELECTED CLASS DATE/TIME */
    var getDateTimes = function(req,res){
        $scope.formselectedClassDateTime = null;
        $scope.upcomingTrainingDateTime = [];
        $http({
            method: 'POST',
            url: 'http://localhost:8081/api/classdatetime',
            data: {Class: req.Class}
        }).success(function (result) {
            $scope.upcomingTrainingDateTime = result;
        });
    };

    $scope.$watch('formData.selectedDateTime', function(newvalue,oldvalue) {
        if(newvalue !== undefined) {
            $scope.selectedDateTime = newvalue;
        }
    });

    $scope.validate = function() {
        var fields = [
            $scope.selectedClass,
            $scope.selectedDateTime
        ];
        var invalid = 0;
        angular.forEach(fields,function(value,index){
            if (value === undefined || value === '') {
                invalid = 1;
            }
        });
        if (invalid === 0) {
            $state.go('form.confirm');
        } else {
            alert('Please select a class and date');
        }
    };
});

/* SUCCESS CONTROLLER */
app.controller('successController', function($scope,$http,$state) {
    
});

/* ERROR CONTROLLER */
app.controller('errorController', function($scope,$http,$state) {
    window.location.href = 'http://www.martinandassoc.com/training-registration'
});


/********************************************************************
* DIRECTIVES
********************************************************************/

app.directive('capitalize', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
           if(inputValue == undefined) inputValue = '';
           var capitalized = inputValue.toUpperCase();
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }         
            return capitalized;
         }
         modelCtrl.$parsers.push(capitalize);
         capitalize(scope[attrs.ngModel]);  // capitalize initial value
     }
   };
});