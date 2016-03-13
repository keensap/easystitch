define(['app'], function (app) {
    'use strict';
    app.directive('compareTo', [
        function() {
            return {
                restrict: 'A', // only activate on element attribute
                require: '?ngModel', // get a hold of NgModelController
                scope: {
                    otherModelValue: "=compareTo"
                },
                link: function (scope, element, attributes, ngModel) {
                    if (!ngModel) return; // do nothing if no ng-model
                    ngModel.$validators.compareTo = function (modelValue) {
                        ngModel.$setValidity('noMatch', modelValue == scope.otherModelValue);
                        return modelValue == scope.otherModelValue;
                    };

                    scope.$watch("otherModelValue", function () {
                        ngModel.$validate();
                    });
                }
            };
        }
    ])
});