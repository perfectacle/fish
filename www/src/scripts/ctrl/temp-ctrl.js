'use strict';
app.controller('TempCtrl', ['$scope', '$rootScope', '$interval', '$location', '$http', 'Modal', function($scope, $rootScope, $interval, $location, $http, Modal) {
  if(!$rootScope.id) {
    Modal.alert('로그인 해주시기 바랍니다.', null, function() {
      $location.path('/login').replace();
    });
    return;
  }
  $rootScope.$on('$routeChangeStart', function() {
    $interval.cancel($scope.interv);
  });
  $scope.init = function() {
    $scope.isDisabled      = false;
    $scope.Modal           = Modal;
    $scope.goBack          = function() {
      window.history.back();
    };
    $scope.getTemp = function() {
      $rootScope.isLoaded = false;
      var config = {
        params: {
          mode: 'manual',
          func: 'temp'
        }
      };
      if($rootScope.arduino) {
        $http.get($rootScope.arduino, config)
             .then(function(data) {
               console.log(data);
               if(data.data) {
                 $rootScope.isLoaded = true;
                 $scope.temp        = +data.data;
               }
             }, Modal.error);
      }
    };
    $scope.getTemp();
    $scope.interv = $interval($scope.getTemp, 5000);
  };
}]);