'use strict';
app.controller('FeedCtrl', ['$scope', '$rootScope', '$timeout', '$location', '$http', 'Modal', function($scope, $rootScope, $timeout, $location, $http, Modal) {
  if(!$rootScope.id) {
    Modal.alert('로그인 해주시기 바랍니다.', null, function() {
      $location.path('/login').replace();
    });
    return;
  }
  $scope.init = function() {
    $scope.Modal           = Modal;
    $scope.goBack          = function() {
      window.history.back();
    };
    $rootScope.getAutoFeed = function() {
      $rootScope.isLoaded = false;
      var config          = {
        params: {
          func: 'feed',
          id: $rootScope.id
        },
        responseType: 'json'
      };
      $http.get('../php/auto.php', config)
           .then(function(data) {
             if(data.data) {
               console.log(data);
               $rootScope.isLoaded = true;
               $scope.feedTime     = data.data.feed_time.substring(6, 8) === '01' ? '' : data.data.feed_time.substring(0, 5);
               $rootScope.feedTime = data.data.feed_time.substring(6, 8) === '01' ? '' : new Date(1970, 0, 1, data.data.feed_time.substring(0, 2), data.data.feed_time.substring(3, 5), 0);
               $rootScope.waitTime = +data.data.wait_time;
               $rootScope.feedCnt  = +data.data.feed_cnt;
             }
           }, Modal.error);
    };
    $scope.fnFeed          = function() {
      $rootScope.isLoaded = false;
      var config          = {
        params: {
          mode: 'manual',
          func: 'feed'
        }
      };
      $scope.isFeeded     = true;
      $http.get($rootScope.arduino, config)
           .then(function() {
             var config = {
               params: {
                 func: 'feed',
                 id: $rootScope.id
               }
             };
             return $http.post('../php/func.php', null, config)
           }, Modal.error)
           .then(function(data) {
             if(data.data !== undefined) {
               $scope.feedCnt = data.data.feed_cnt;
               $timeout(function() {
                 $rootScope.isLoaded = true;
                 $scope.isFeeded     = false;
               }, 500)
             }
           }, Modal.error)
    };

    $rootScope.getAutoFeed();
  }
}]);