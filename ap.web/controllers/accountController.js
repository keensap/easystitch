'use strict';
define(['app'], function (app) {
    app.controller('accountController',
    [
        '$scope',
        'authenticationService',
        '$stateParams',
        '$location',
        '$window',
        function ($scope, service, $stateParams, $location, $window) {
            $scope.message = {
                text: '',
                type: '',
                messageClass: '',
                errors: null
            };

            $scope.page =
            {
                title: 'Account'
            }

            //LOGIN
            //Admin User Controller (login, logout)
            var login = function login(username, password) {
                if (username !== undefined && password !== undefined) {

                    service.login(username, password)
                    .success(function (data, status, headers, config) {
                        if (data != null && data.message != null) {
                            setMessage(data.message, 'error', data.errors);
                        } else {
                            setMessage('Login successfully', 'success', null);
                            global.isLoggedIn = true;
                            $window.sessionStorage.token = data.token;
                            service.setCredentials(username, data.token);
                            $location.path("/");
                        }

                    }).error(function (data, status, headers, config) {
                        if (data) {
                            setMessage(data, 'error', data.errors);
                        } else {
                            setMessage('Connection Error', 'error', null);
                        }
                    });
                }
            }

            //LOGOUT
            var logout = function logout() {
                if (global.isLoggedIn) {
                    global.isLoggedIn = false;
                    global.isAuthenticated = false;
                    global.user = null;
                    delete $window.sessionStorage.token;
                    $location.path("/");
                }
            }

            //TODO: move it to some util class
            //private methods
            var setMessage = function (message, type, errors) {
                $scope.message = {
                    text: message,
                    type: type,
                    messageClass: type == 'error' ? 'alert alert-danger' : (type == 'success' ? 'alert alert-success' : ''),
                    errors: errors
                };
            }
            $scope.back = function () {
                $window.history.back();
            }

            //public method
            $scope.login = login;
            $scope.logout = logout;
        }
    ]);
});