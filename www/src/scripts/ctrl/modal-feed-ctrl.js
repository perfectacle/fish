'use strict';
app.controller('ModalFeedCtrl', ['$rootScope', '$scope', '$http', '$uibModalInstance', 'Modal', function($rootScope, $scope, $http, $uibModalInstance, Modal) {
  // 경고창에서 포커스 주기 위한 초기화 함수.
  $rootScope.isShowModal = true;
  $scope.ok              = function() {
    $rootScope.isLoaded = true;
    var config = {
      params: {
        mode: 'upd',
        func: 'feed',
        feed_time: $scope.feedTime ? /\d\d:\d\d/.exec($scope.feedTime)[0] + ':00' : '00:00:01',
        wait_time: $scope.waitTime ? $scope.waitTime : 0,
        id: $rootScope.id
      }
    };
    $http.get($rootScope.arduino, config)
         .then(function() {
           return $http.post('../php/auto.php', null, config)
         }, Modal.error)
         .then(function(data) {
           if(data.data) {
             Modal.alert('자동 밥주기 설정에 성공했습니다.');
             $rootScope.isLoaded = true;
             $rootScope.getAutoFeed();
           }
         }, Modal.error);
    $uibModalInstance.close();
  };
  $rootScope.closeModal  = function() {
    $uibModalInstance.dismiss('cancel')
  }
}]);