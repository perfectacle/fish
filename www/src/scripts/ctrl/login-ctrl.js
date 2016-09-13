'use strict';
app.controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', '$uibModal', 'Modal', function($scope, $rootScope, $http, $location, $uibModal, Modal) {
  if($rootScope.id) {
    Modal.alert('이미 로그인 되었습니다.', null, function() {
      $location.path('/#').replace();
    });
    return;
  }
  $scope.init = function() {
    $scope.regExpIdPw = /^[a-z\d]{4,20}$/;
    $scope.fnLogin    = function() {
      var config          = {
        params: {
          mode: 'chkId',
          id: $scope.user.id,
          pw: $scope.user.pw
        }
      };
      $rootScope.isLoaded = false;
      $http.post('../php/login.php', null, config)
           // ID 존재 여부 확인
           .then(function(data) {
             if(data.data) {
               config.params.mode = '';
               return $http.get('../php/login.php', config);
             } else {
               Modal.alert('ID가 존재하지 않습니다.', null, function() {
                 $scope.focus.id = true;
               });
               $rootScope.isLoaded = true;
               return false;
             }
           }, Modal.error)
           // 비밀번호 일치 여부 확인
           .then(function(data) {
             if(data.data) {
               $rootScope.id = data.data;
               config        = {
                 params: {
                   mode: 'sel',
                   m_id: $rootScope.id
                 },
                 responseType: 'json'
               };
               return $http.get('../php/ip.php', config);
             } else if(data.data === undefined) {
             }
             else {
               Modal.alert('비밀번호가 일치하지 않습니다.', null, function() {
                 $scope.focus.pw = true;
               });
             }
             $rootScope.isLoaded = true;
             return false;
           }, Modal.error)
           .then(function(data) {
             console.log(data);
             if(data.data) {
               $rootScope.arduino = "http://" + data.data['l_ip'] + ':' + data.data.port;
               config.params      = {
                 id_send: $rootScope.id
               };
               return $http.get($rootScope.arduino, config);
             }
             return false;
           }, Modal.error)
           .then(function(data) {
             if(data.data) {
               $rootScope.isLoaded = true;
               $location.path('/#').replace();
             }
           }, Modal.error);
    }
  }
}]);