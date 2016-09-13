'use strict';
app.controller('SignUpCtrl', ['$scope', '$rootScope', '$http', '$location', 'Modal', function($scope, $rootScope, $http, $location, Modal) {
  if($rootScope.id) {
    Modal.alert('이미 로그인 되었습니다.', null, function() {
      $location.path('/#').replace();
    });
    return;
  }
  $scope.init = function() {
    $scope.regExpArduinoId = /^[a-f\d]{2}-[a-f\d]{2}-[a-f\d]{2}-[a-f\d]{2}-[a-f\d]{2}-[a-f\d]{2}$/i;
    $scope.regExpIdPw      = /^[a-z\d]{4,20}$/;
    $scope.fnSignUp        = function() {
      var config          = {
        params: {
          mode: 'chkArduino',
          arduinoId: $scope.user.arduinoId,
          id: $scope.user.id,
          pw: $scope.user.pw
        }
      };
      // 아두이노 ID 유효성 검사.
      $rootScope.isLoaded = false;
      $http.post('../php/sign-up.php', null, config)
           .then(function(data) {
             if(data.data) {
               config.params.mode = 'chkArduino2';
               return $http.post('../php/sign-up.php', null, config);
             } else {
               $rootScope.isLoaded = true;
               Modal.alert('아두이노에 동봉된 ID를\n정확히 입력해주세요.', null, function() {
                 $scope.focus.arduinoId = true;
               });
               return false;
             }
           }, Modal.error)
           // 아두이노 ID 중복 검사
           .then(function(data) {
             if(data.data) {
               $rootScope.isLoaded = true;
               Modal.alert('이미 등록된 아두이노입니다.', null, function() {
                 $scope.focus.arduinoId = true;
               });
               return false;
             } else if(data.data === undefined) {
               return false;
             } else {
               config.params.mode = 'chkId';
               return $http.post('../php/sign-up.php', null, config);
             }
           }, Modal.error)
           // ID 중복 검사.
           .then(function(data) {
             if(data.data) {
               $rootScope.isLoaded = true;
               Modal.alert('이미 등록된 ID입니다.', null, function() {
                 $scope.focus.id = true;
               });
               return false;
             } else if(data.data === undefined) {
               return false;
             } else {
               config.params.mode = '';
               return $http.post('../php/sign-up.php', null, config);
             }
           }, Modal.error)
           // 회원 가입
           .then(function(data) {
             $rootScope.isLoaded = true;
             if(data) {
               Modal.alert('회원가입이 완료 되었습니다.', null, function() {
                 $location.path('/login');
               });
             }
           }, Modal.error);
    }
  }
}]);