'use strict';
app.controller('ModalCtrl', ['$rootScope', '$scope', '$uibModalInstance', 'msg', function($rootScope, $scope, $uibModalInstance, msg) {
  // 경고창에서 포커스 주기 위한 초기화 함수.
  $scope.focus           = {
    alert: true
  };
  $rootScope.isShowModal = true;
  $scope.msg             = msg;
  $rootScope.closeModal  = function() {
    $uibModalInstance.close();
  }
}]);