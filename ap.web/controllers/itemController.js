'use strict';
define(['app'], function (app) {
    app.controller('itemController', [
        '$scope',
        'itemService',
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
                title: 'Items'
            }

            //GET LIST
            var getList = function (search, orderBy, pageNumber) {
                $scope.isCollapsed = true;
                $scope.loading = true;
                

                $scope.predicate = 'name';
                $scope.reverse = false;

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
                    $scope.items = data.data;
                    $scope.totalCount = data.total_count;
                    $scope.pageNumber = data.page_number || 0;
                    $scope.loading = $scope.isCollapsed = false;                     
                })
                .error(function (data, status, headers, config) {
                    setMessage(data, 'error', data.errors);
                    $scope.loading = $scope.isCollapsed = false;
                    $scope.items = [];
                });

            }


            //GET
            var get = function (id) {
                $scope.loading = true;

//                $scope.suppliers = [{ code: '', name: '[Please Select]' }];
//                service.getSuppliers()
//                 .success(function (data, status, headers, config) {
//                     $scope.suppliers = data.data;
//                     if (id) {
//                         $scope.item = { suppler: '' };
//                         $scope.loading = false;
//                     }
//                 })
//                 .error(function (data, status, headers, config) {
//                     setMessage(data, 'error', data.errors);
//                     if (id) $scope.loading = false;
//                 });

                if (id) {
                    service.get(id)
                    .success(function (data, status, headers, config) {
                        $scope.item = data;
                        $scope.loading = false;
                    })
                    .error(function (data, status, headers, config) {
                        setMessage(data, 'error', data.errors);
                        $scope.loading = false;
                    });
                } else {
                    $scope.item = {suppler:''};
                    $scope.loading = false;
                }
            }

            //UPDATE
            var update = function () {
                var action;
                if ($scope.form.$valid) {
                    if ($stateParams.id == 'new') {
                        action = service.insert($scope.item);
                    } else {
                        action = service.update($stateParams.id, $scope.item);
                    }
                }

                if (action) {
                    $scope.loading = true;
                    action.success(function (data, status, headers, config) {
                        if (data.errors) {
                            setMessage(data.message, 'error', data.errors);
                        } else {
                            setMessage('Saved successfully', 'success', null);
                            $location.url('/item/' + data._id);
                        }
                        $scope.loading = false;
                    })
                    .error(function (data, status, headers, config) {
                        if (data)
                            setMessage(data, 'error', data.errors);
                        else
                            setMessage('unknow error occured', 'error', null);
                        $scope.loading = false;
                    });
                }
            }

            //DELETE
            var deleteRecord = function () {
                var action;
                action = service.delete($stateParams.id, $scope.item)
                .success(function (data, status, headers, config) {
                    if (data!=null && data.message!=null) {
                        setMessage(data.message, 'error', data.errors);
                    } else {
                        setMessage('Deleted successfully', 'success', null);
                        $location.url('/item/');
                    }
                })
                .error(function (data, status, headers, config) {
                    setMessage(data, 'error', data.errors);
                });
            }

            var getSuppliers = function () {
                
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
            $scope.update = update;
            $scope.delete = deleteRecord;
        }
    ]);
});