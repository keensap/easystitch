
define(['app', '../services/encodingService'], function (app, encodingService) {
    app.service('authenticationService', [
        '$http', '$cookieStore', '$rootScope', '$timeout', 
        function ($http, $cookieStore, $rootScope, $timeout ) {

            var api = {};
            var baseUrl = global.serviceUrl + "/accounts/";
            var headers = {
                'Content-Type': 'application/json',
                'Accept': 'text/json'
            };


            api.login = function (username, password) {
                return $http.post(baseUrl, { username: username, password: password });
            };

            api.logOut = function () {

            };

            //api.setCredentials = function (username, password) {
            //    var authdata = encodingService.encode(username + ':' + password);

            //    $rootScope.globals = {
            //        currentUser: {
            //            username: username,
            //            authdata: authdata
            //        }
            //    };
            //    global.user = $rootScope.globals.currentUser;
            //    $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            //    $cookieStore.put('globals', $rootScope.globals);
            //}
            api.setCredentials = function (username, token) {
                $rootScope.globals = {
                    currentUser: {
                        username: username,
                        token: token
                    }
                };
                global.user = $rootScope.globals.currentUser;
                //$http.defaults.headers.common.Authorization = 'Basic ' + token; // jshint ignore:line
                //$http.defaults.headers['x-access-token'] = token;
                $cookieStore.put('globals', $rootScope.globals);
            };

            api.clearCredentials = function () {
                $rootScope.globals = {};
                $cookieStore.remove('globals');
                //$http.defaults.headers.common.Authorization = 'Basic ';
                //$http.defaults.headers['x-access-token'] = null;
            };

            //api.getCredentials = function () {
            //    $rootScope.globals = $cookieStore['globals'];
            //    if ($rootScope.globals != null && $rootScope.globals.currentUser != null) {
            //        return $rootScope.globals.currentUser.authdata;
            //    }
            //}
            api.getCredentials = function () {
                $rootScope.globals = $cookieStore['globals'];
                if ($rootScope.globals !== null && $rootScope.globals.currentUser !== null) {
                    return $rootScope.globals.currentUser;
                }
            };

            return api;
        }
    ]);

    

});