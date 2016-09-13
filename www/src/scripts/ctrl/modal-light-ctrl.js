'use strict';
app.controller('ModalLightCtrl', ['$rootScope', '$scope', '$http', '$uibModalInstance', 'Modal', function($rootScope, $scope, $http, $uibModalInstance, Modal) {
  // 경고창에서 포커스 주기 위한 초기화 함수.
  $rootScope.isShowModal = true;
  $scope.ok              = function() {
    $rootScope.isLoaded = false;
    var config = {
      params: {
        mode: 'upd',
        func: 'light',
        onTime: $scope.onTime ? /\d\d:\d\d/.exec($scope.onTime)[0] + ':00' : '00:00:01',
        offTime: $scope.offTime ? /\d\d:\d\d/.exec($scope.offTime)[0] + ':00' : '00:00:01',
        id: $rootScope.id
      }
    };
    $http.get($rootScope.arduino, config)
         .then(function() {
           return $http.post('../php/auto.php', null, config)
         }, Modal.error)
         .then(function(data) {
           if(data.data) {
             Modal.alert('자동 조명 ON/OFF\n설정에 성공했습니다.');
             $rootScope.isLoaded = true;
             $rootScope.getAutoLight();
           }
         }, Modal.error);
    $uibModalInstance.close();
  };
  $rootScope.closeModal  = function() {
    $uibModalInstance.dismiss('cancel')
  }
}]);