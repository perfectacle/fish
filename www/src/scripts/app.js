'use strict';
// 전역 변수로 선언해두고, 여기서 의존성을 전부 주입.
var app = angular.module('fish', ['ngRoute', 'ngAnimate', 'treasure-overlay-spinner', 'ngSanitize', 'ui.bootstrap']);
app.run(['$rootScope', '$route', '$http', '$location', '$routeParams', 'Modal', function($rootScope, $route, $http, $location, $routeParams, Modal) {
  // 앱 전역에서 사용할 변수들을 미리 선언.
  $rootScope.isLoaded = true;
  // 라우터의 타이틀을 지정하기 위함.
  $rootScope.$on('$routeChangeSuccess', function() {
    document.title = $route.current.title;
  });

  // ng-repeat으로 반복하기 위해 지정된 숫자의 크기를 가진 배열을 만들어냄.
  $rootScope.getNumber = function(num) {
    return new Array(num);
  };
  $rootScope.$on('$routeChangeStart', function(evt) {
    if($rootScope.isShowModal) {
      $rootScope.closeModal();
      $rootScope.isShowModal = false;
      evt.preventDefault();
    }
  });
  // 세션에서 ID값 받아오기.
  var config          = {
    params: {
      mode: 'get'
    }
  };
  $rootScope.isLoaded = false;
  $http.get('../php/session.php', config)
       .then(function(data) {
         // 로그인 했으면
         if(data.data) {
           $rootScope.id = data.data;
           config.params = {
             mode: 'sel',
             m_id: $rootScope.id
           };
           return $http.get('../php/ip.php', config);
         } else {
           // 로그인 안 했으면
           $rootScope.isLoaded = true;
           if(window.location.hash === '#/') {
             $location.path('/login').replace();
           }
           return false;
         }
       }, Modal.error)
       // DB 등록된 아두이노의 최근 IP를 불러옴.
       .then(function(data) {
         $rootScope.isLoaded = true;
         if(data.data) {
           $rootScope.arduino = "http://" + data.data['p_ip'] + ':' + data.data.port;
         } else if(data.data === undefined) {
         }
       }, Modal.error);
  /* 안드로이드에서 키패드가 올라오면 자동으로 리사이징 하는 것을 방지. */
  var height = $('html').height();
  $(window).resize(function() {
    $('body').height(height);
  });
}]);