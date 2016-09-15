'use strict';
app.controller('TimeTestCtrl', ['$scope', '$rootScope', '$timeout', '$location', '$http', 'Modal', function($scope, $rootScope, $timeout, $location, $http, Modal) {
  if(!$rootScope.id) {
    Modal.alert('로그인 해주시기 바랍니다.', null, function() {
      $location.path('/login').replace();
    });
    return;
  }
  $scope.init = function() {
    $scope.goBack          = function() {
      window.history.back();
    };
    $scope.getTime = function() {
      $scope.isLoadinged = true;
      var config          = {
        params: {
          time_test: true
        }
      };
      $http.get($rootScope.arduino, config)
           .then(function(data) {
             if(data.data) {
               console.log(data);
               $scope.isLoadinged = false;
               $scope.time = data.data;
             }
           }, Modal.error);
    };
  }
}]);