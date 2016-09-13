'use strict';
app.controller('LightCtrl', ['$scope', '$rootScope', '$timeout', '$location', '$http', 'Modal', function($scope, $rootScope, $timeout, $location, $http, Modal) {
  if(!$rootScope.id) {
    Modal.alert('로그인 해주시기 바랍니다.', null, function() {
      $location.path('/login').replace();
    });
    return;
  }
  // 수온 조절 페이지에서 쓸 변수 초기화.
  $scope.init = function() {
    $scope.Modal            = Modal;
    $scope.goBack           = function() {
      window.history.back();
    };
    $rootScope.getAutoLight = function() {
      $rootScope.isLoaded = false;
      var config          = {
        params: {
          func: 'light',
          id: $rootScope.id
        },
        responseType: 'json'
      };
      $http.get('../php/auto.php', config)
           .then(function(data) {
             if(data.data) {
               $rootScope.isLoaded = true;
               $scope.onTime       = data.data.on_time.substring(6, 8) === '01' ? '' : data.data.on_time.substring(0, 5);
               $rootScope.onTime   = data.data.on_time.substring(6, 8) === '01' ? '' : new Date(1970, 0, 1, data.data.on_time.substring(0, 2), data.data.on_time.substring(3, 5), 0);
               $scope.offTime      = data.data.off_time.substring(6, 8) === '01' ? '' : data.data.off_time.substring(0, 5);
               $rootScope.offTime  = data.data.off_time.substring(6, 8) === '01' ? '' : new Date(1970, 0, 1, data.data.off_time.substring(0, 2), data.data.off_time.substring(3, 5), 0);
               $rootScope.isOn     = +data.data.is_on;
             }
           }, Modal.error);
    };
    $scope.onLight          = function() {
      $scope.disabled     = true;
      $rootScope.isLoaded = false;
      var config          = {
        params: {
          mode: 'manual',
          func: 'light',
          status: 'on'
        }
      };
      $http.get($rootScope.arduino, config)
           .then(function() {
             var config = {
               params: {
                 func: 'light',
                 status: 'on',
                 id: $rootScope.id
               }
             };
             return $http.post('../php/func.php', null, config)
           }, Modal.error)
           .then(function(data) {
             console.log(data);
             $rootScope.isLoaded = true;
             $scope.isOn         = data.data.is_on;
             $timeout(function() {
               $scope.disabled = false;
             }, 500)
           }, Modal.error);
    };
    $scope.offLight         = function() {
      $scope.disabled     = true;
      $rootScope.isLoaded = false;
      var config          = {
        params: {
          mode: 'manual',
          func: 'light',
          status: 'off'
        }
      };
      console.log($rootScope.arduino);
      $http.get($rootScope.arduino, config)
           .then(function() {
             var config = {
               params: {
                 func: 'light',
                 status: 'off',
                 id: $rootScope.id
               }
             };
             return $http.post('../php/func.php', null, config)
           }, Modal.error)
           .then(function(data) {
             console.log(data);
             $scope.isOn = +data.data.is_on;
             $timeout(function() {
               $scope.disabled     = false;
               $rootScope.isLoaded = true;
             }, 500)
           }, Modal.error);
    };

    $rootScope.getAutoLight();
  };
}]);