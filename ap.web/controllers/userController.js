'use strict';
define(['app'], function (app) {
    app.controller('userController',
    [
        '$scope',
        'userService',
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
                title: 'User'
            }

            //GET LIST
            var getList = function (search, orderBy, pageNumber) {
                $scope.isCollapsed = true;
                $scope.loading = true;

                $scope.pageSize = 5;
                $scope.pageNumber = pageNumber || 0;

                $scope.search = search || "";
                $scope.orderBy = orderBy || "";

                //Filter
                $scope.filter = function () {
                    getList($scope.search, $scope.orderBy, $scope.pageNumber, $scope.pageSize);
                };

                //Page 
                $scope.pageChanged = function () {
                    getList($scope.search, $scope.orderBy, $scope.pageNumber, $scope.pageSize);
                };

                //Sort
                $scope.changeSorting = function ($event, column) {
                    if (column != null && column != "") {
                        $scope.orderBy = EasyStitch.Common.Data.changeSorting(column, $scope.orderBy);
                        getList($scope.search, $scope.orderBy, $scope.pageNumber, $scope.pageSize);
                    }
                };

                //Sort Icon
                $scope.getIcon = function ($event, column) {
                    return EasyStitch.Common.Data.getIcon(column, $scope.orderBy);
                }


                service.getList($scope.search, $scope.orderBy, $scope.pageNumber, $scope.pageSize)
                .success(function (data, status, headers, config) {
                    $scope.users = data.data;
                    $scope.totalCount = data.total_count;
                    $scope.pageNumber = data.page_number;
                    $scope.loading = $scope.isCollapsed = false;                     
                })
                .error(function (data, status, headers, config) {
                    setMessage(data, 'error', data.errors);
                    $scope.loading = $scope.isCollapsed = false;
                    $scope.users = [];
                });

            }


            //GET
            var get = function (id) {
                if (id != null) {
                    $scope.loading = true;
                    service.get(id)
                    .success(function (data, status, headers, config) {
                        $scope.user = data;
                        $scope.user.confirm_password = $scope.user.password
                        $scope.loading = false;
                    })
                    .error(function (data, status, headers, config) {
                        setMessage(data, 'error', data.errors);
                        $scope.loading = false;
                    });
                } else {
                    $scope.user = { is_active: true }
                }
            }

            //UPDATE
            var update = function () {
                var action;
                if ($scope.form.$valid) {
                    if ($stateParams.id == 'new') {
                        action = service.insert($scope.user);
                    } else {
                        action = service.update($stateParams.id, $scope.user);
                    }
                }

                if (action) {
                    $scope.loading = true;
                    action.success(function (data, status, headers, config) {
                        if (data.message) {
                            setMessage(data.message, 'error', data.errors);
                        } else {
                            setMessage('Saved successfully', 'success', null);
                            $location.url('/user/' + data._id);
                        }
                        $scope.loading = false;
                    })
                    .error(function (data, status, headers, config) {
                        setMessage(data, 'error', data.errors);
                        $scope.loading = false;
                    });
                }
            }

            //DELETE
            var deleteRecord = function () {
                var action;
                action = service.delete($stateParams.id, $scope.user)
                .success(function (data, status, headers, config) {
                    if (data!=null && data.message!=null) {
                        setMessage(data.message, 'error', data.errors);
                    } else {
                        setMessage('Deleted successfully', 'success', null);
                        $location.url('/user/');
                    }
                }).error(function (data, status, headers, config) {
                    setMessage(data, 'error', data.errors);
                });
            }

            //LOGIN
            //Admin User Controller (login, logout)
            var logIn = function logIn(username, password) {
                if (username !== undefined && password !== undefined) {

                    service.logIn(username, password)
                    .success(function (data, status, headers, config) {
                        if (data != null && data.message != null) {
                            setMessage(data.message, 'error', data.errors);
                        } else {
                            setMessage('Login successfully', 'success', null);
                            global.isLogged = true;
                            $window.sessionStorage.token = data.token;
                            $location.path("/");
                        }
                        
                    }).error(function (data, status, headers, config) {
                        
                        console.log(status);
                        console.log(data);
                        setMessage(data, 'error', data.errors);
                    });
                }
            }

            //LOGOUT
            var logout = function logout() {
                if (global.isLogged) {
                    global.isLogged = false;
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
            

            //init
            if ($stateParams.id == null) {
                getList();
            } else {
                if ($stateParams.id == 'new') {
                    get();
                } else {
                    get($stateParams.id);
                }
            }

            //public method
            $scope.getList = getList;
            $scope.update = update;
            $scope.delete = deleteRecord;
            $scope.logIn = logIn;
            $scope.logout = logout;
        }
    ]);
});