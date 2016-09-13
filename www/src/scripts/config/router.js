'use strict';
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {title: '메인 - 떡밥밥', templateUrl: './views/main.html', controller: 'MainCtrl'})
  .when('/login', {title: '로그인 - 떡밥밥', templateUrl: './views/login.html', controller: 'LoginCtrl'})
  .when('/sign-up', {title: '회원가입 - 떡밥밥', templateUrl: './views/sign-up.html', controller: 'SignUpCtrl'})
  .when('/feed', {title: '밥주기 - 떡밥밥', templateUrl: './views/feed.html', controller: 'FeedCtrl'})
  .when('/temp', {title: '수온 - 떡밥밥', templateUrl: './views/temp.html', controller: 'TempCtrl'})
  .when('/light', {title: '조명 관리 - 떡밥밥', templateUrl: './views/light.html', controller: 'LightCtrl'})
  .otherwise({redirectTo: '/'});
}]);