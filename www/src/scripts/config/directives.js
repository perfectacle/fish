// 비밀번호 확인과 비밀번호가 일치하는지
app.directive('pwCheck', [function() {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      var firstPassword = '#' + attrs.pwCheck;
      elem.add(firstPassword).on('keyup', function() {
        scope.$apply(function() {
          var v = elem.val() === $(firstPassword).val();
          ctrl.$setValidity('pwmatch', v);
        });
      });
    }
  }
}])
   .directive('ngFocusMe', ['$timeout', function($timeout) {
     return {
       scope: {trigger: '=ngFocusMe'},
       link: function(scope, element) {
         scope.$watch('trigger', function(value) {
           if(value === true) {
             $timeout(function() {
               element[0].focus();
             });
           }
         });
       }
     };
   }]);