'use strict';
app.service('Modal', ['$rootScope', '$uibModal', function($rootScope, $uibModal) {
  return {
    alert: function(msg, size, callback) {
      var modalInstance = $uibModal.open({
        templateUrl: './views/alert.html',
        windowClass: 'modal-center',
        controller: 'ModalCtrl',
        size: size,
        resolve: {
          msg: function() {
            return msg;
          }
        }
      });
      modalInstance.result.then(function() {
        $rootScope.isShowModal = false;
        if(callback) callback();
      }, function() {
        $rootScope.isShowModal = false;
        if(callback) callback();
      });
    },
    error: function() {
      var modalInstance = $uibModal.open({
        templateUrl: './views/alert.html',
        windowClass: 'modal-center',
        controller: 'ModalCtrl',
        resolve: {
          msg: function() {
            return '서버에 문제가 있습니다.\n관리자에게 문의해주세요!';
          }
        }
      });
      modalInstance.result.then(function() {
        $rootScope.isLoaded    = true;
        $rootScope.isShowModal = false;
      }, function() {
        $rootScope.isLoaded    = true;
        $rootScope.isShowModal = false;
      });
    },
    modal: function(serv) {
      var modalInstance = $uibModal.open({
        templateUrl: './views/modal-' + serv + '.html',
        windowClass: 'modal-center',
        controller: 'Modal' + serv.charAt(0).toUpperCase() + serv.slice(1) + 'Ctrl',
        resolve: {
          msg: function() {
            return '서버에 문제가 있습니다.\n관리자에게 문의해주세요!';
          }
        }
      });
      modalInstance.result.then(function() {
        $rootScope.isShowModal = false;
      }, function() {
        $rootScope.isShowModal = false;
      });
    }
  }
}]);