define(['angular'], function () {
    return {
        logDecoratorCallback: ['$delegate', 'logService', function ($delegate, logService) {
            logService.enabled = true;
            var methods = {
                error: function () {
                    if (logService.enabled) {
                        $delegate.error.apply($delegate, arguments);
                        logService.error.apply(null, arguments);
                    }
                },
                log: function () {
                    if (logService.enabled) {
                        $delegate.log.apply($delegate, arguments);
                        logService.log.apply(null, arguments);
                    }
                },
                info: function () {
                    if (logService.enabled) {
                        $delegate.info.apply($delegate, arguments);
                        logService.info.apply(null, arguments);
                    }
                },
                warn: function () {
                    if (logService.enabled) {
                        $delegate.warn.apply($delegate, arguments);
                        logService.warn.apply(null, arguments);
                    }
                }
            };
            return methods;
        }],

        logServiceCallback: [function () {
            var service = {
                error: function () {
                    self.type = 'error';
                    log.apply(self, arguments);
                },
                warn: function () {
                    self.type = 'warn';
                    log.apply(self, arguments);
                },
                info: function () {
                    self.type = 'info';
                    log.apply(self, arguments);
                },
                log: function () {
                    self.type = 'log';
                    log.apply(self, arguments);
                },
                enabled: false,
                logs: []
            };

            var log = function () {

                args = [];
                if (typeof arguments === 'object') {
                    for (var i = 0; i < arguments.length; i++) {
                        arg = arguments[i];
                        var exception = {};
                        exception.message = arg.message;
                        exception.stack = arg.stack;
                        args.push(JSON.stringify(exception));
                    }
                }

                var eventLogDateTime = new Date();
                var logItem = {
                    time: eventLogDateTime,
                    message: args.join('\n'),
                    type: type
                };


                console.log('Custom logger [' + logItem.time + '] ' + logItem.message.toString());
                service.logs.push(logItem);
            };


            return service;
        }],

        logControllerCallback: ['$scope', '$log', function ($scope, $log) {
            $scope.$log = $log;
            $scope.throwError = function () {
                functionThatThrows();
            };

            $scope.throwException = function () {
                throw {
                    message: 'error message'
                };
            };

            $scope.throwNestedException = function () {
                functionThrowsNestedExceptions();
            };

            functionThatThrows = function () {
                var x = y;
            };

            functionThrowsNestedExceptions = function () {
                try {
                    var a = b;
                } catch (e) {
                    try {
                        var c = d;
                    } catch (ex) {
                        $log.error(e, ex);
                    }
                }
            };
        }]
    }
});



//define(['$delegate', 'Logging'], function ($delegate, Logging) {

//});