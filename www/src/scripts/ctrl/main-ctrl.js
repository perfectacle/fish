'use strict';
app.controller('MainCtrl', ['$scope', '$rootScope', '$location', '$http', 'Modal', function($scope, $rootScope, $location, $http, Modal) {
  // 메인 페이지에서 쓸 변수 초기화.
  if(!$rootScope.id) {
    Modal.alert('로그인 해주시기 바랍니다.', null, function() {
      $location.path('/login').replace();
    });
    return;
  }
  $scope.init = function() {
    $scope.menus    = [
      {
        img: './img/nav-feed.png',
        desc: '밥주기',
        url: '#feed'
      },
      {
        img: './img/nav-temp.png',
        desc: '수온',
        url: '#temp'
      },
      {
        img: './img/nav-light.png',
        desc: '조명 관리',
        url: '#light'
      }
    ];
    $scope.fnLogout = function() {
      $rootScope.isLoaded = false;
      $http.post('../php/session.php', null, null)
           .then(function() {
             $rootScope.isLoaded = true;
             $rootScope.id       = '';
             $rootScope.arduino  = '';
             Modal.alert('로그아웃 되었습니다.', null, function() {
               $location.path('/login').replace();
             });
           }, Modal.error);
    }
  };
}]);