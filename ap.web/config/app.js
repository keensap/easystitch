'use strict';
define(['routes', 'utils', 'logger'],
    function (routesConfig, utils, logger) {
        var app = angular.module('app', ['ui.router']);

        app.config(
        [
            '$stateProvider',
            '$urlRouterProvider',
            '$locationProvider',
            '$controllerProvider',
            '$compileProvider',
            '$filterProvider',
            '$provide',
            '$httpProvider',
            '$logProvider',

            function ($stateProvider, $urlRouterProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider, $logProvider) {
                app.controller = $controllerProvider.register;
                app.directive = $compileProvider.directive;
                app.filter = $filterProvider.register;
                app.factory = $provide.factory;
                app.service = $provide.service;
                app.constant = $provide.constant;

                $httpProvider.defaults.useXDomain = true;
                delete $httpProvider.defaults.headers.common['X-Requested-With'];

                $locationProvider.html5Mode(true);

                if (routesConfig.routes !== undefined) {
                    angular.forEach(routesConfig.routes, function (route, path) {

                        var state = {
                            url: route.url,
                            parent: route.parent,
                            abstract: route.abstract,
                            controller: route.controller,
                            templateUrl: route.templateUrl
                        };

                        if (route.views != null) {
                            state.views = {};
                            angular.forEach(route.views, function (view, name) {
                                state.views[name] = {
                                    templateUrl: view.templateUrl,
                                    controller: view.controller,
                                    parent: view.parent,
                                    resolve: {}
                                };

                                if (view.dependencies != null) {
                                    state.views[name].resolve = {
                                        loadController: utils.loadController(view.dependencies)
                                    }
                                }
                            });
                        }
                        if (route.dependencies != null) {
                            state.resolve = {
                                loadController: utils.loadController(route.dependencies)
                            }
                        }

                        $stateProvider.state(path, state);
                    });
                }

                if (routesConfig.defaultRoutePaths !== undefined) {
                    $urlRouterProvider.otherwise({ redirectTo: routesConfig.defaultRoutePaths });
                }
                $httpProvider.interceptors.push('tokenInterceptor');

                $provide.decorator('$log', logger.logDecoratorCallback);
                
            }
        ]);
        
        app.service('logService', logger.logServiceCallback);
        app.controller('logController', logger.logControllerCallback);

        app.factory('tokenInterceptor', [
        '$q', '$window', '$location', '$log',
        function ($q, $window, $location, $log) {
            return {
                request: function (config) {
                    $log.info("request-url:" + config.url);
                    config.headers = config.headers || {};
                    if ($window.sessionStorage.token) {
                        config.headers['x-access-token'] = $window.sessionStorage.token;
                    }
                    return config;
                },

                requestError: function (rejection) {
                    $log.error(rejection);
                    return $q.reject(rejection);
                },

                /* Set Authentication.isAuthenticated to true if 200 received */
                response: function (response) {
                    $log.info("response.status:" + response.status);
                    if (response != null && response.status == 200 && $window.sessionStorage.token && !global.isAuthenticated) {
                        global.isAuthenticated = true;
                    }
                    return response || $q.when(response);
                },

                /* Revoke client authentication if 401 is received */
                responseError: function (rejection) {
                    $log.error(rejection);
                    if (rejection != null && (rejection.status === 403 || rejection.status === -1)) {
                        delete $window.sessionStorage.token;
                        global.isAuthenticated = false;
                        $location.path("/login");
                    }

                    return $q.reject(rejection);
                }
            };
        }]);

        app.run([
                '$rootScope', '$location', '$cookieStore', '$http',
                function ($rootScope, $location, $cookieStore, $http) {
                    $rootScope.$on("$stateChangeStart", function (e, toState, toParams, fromState, fromParams) {
                        // redirect to login page if not logged in and trying to access a restricted page
                        var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
                        var loggedIn = null;
                        if ($rootScope.globals && $rootScope.globals.currentUser) {
                            loggedIn = $rootScope.globals.currentUser;
                            global.isLoggedIn = true;
                            global.user = $rootScope.globals.currentUser;
                        }
                        else {
                            // getting data from cookies
                            $rootScope.globals = $cookieStore.get('globals');
                            if ($rootScope.globals != null && $rootScope.globals.currentUser != null && $rootScope.globals.currentUser.token != null) {
                                var username = $rootScope.globals.currentUser.username;
                                var token = $rootScope.globals.currentUser.token;
                                global.isLoggedIn = true;
                                global.user = $rootScope.globals.currentUser;
                                loggedIn = $rootScope.globals.currentUser;
                            }
                        }
                        if (restrictedPage && !loggedIn) {
                            $location.path('/login');
                        }
                    });
                }
        ]);

        return app;
    });