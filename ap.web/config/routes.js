'use strict';
define([], function ()
{
    return {
        
        defaultRoutePath: '/',
        routes: {
            '/': {
                url: '',
                abstract: true,
                views: {
                    'layout': {
                        templateUrl: 'views/layouts/layout.html',
                    }
                }
            },
            'main': {
                url: '',
                abstract: true,
                views: {
                    'layout': {
                        templateUrl: 'views/layouts/layout-login.html',
                    }
                }
            },
            '/.tpl': {
                url: '',
                abstract: true,
                views: {
                    'header': {
                        templateUrl: 'views/partials/header.html'
                    },
                    'footer': {
                        templateUrl: 'views/partials/footer.html'
                    },
                    'nav@/.tpl': {
                        templateUrl: 'views/partials/navigation.html'
                    }
                }
            },
            '/.tpl.home': {
                url: '/',
                views: {
                    'container@/': {
                        templateUrl: '/views/home.html',
                        controller: 'homeController',
                        dependencies: [
                            'controllers/homeController'
                        ]
                    }
                }

            },
            
            '/.tpl.item': {
                url: "/item",
                views: {
                    'container@/': {
                        templateUrl: '/views/item/list.html',
                        controller: 'itemController',
                        dependencies: [
                            'controllers/itemController',
                            'services/itemService'
                        ]
                    }
                }
            },
            '/.tpl.itemview': {
                url: "/item/:id",
                views: {
                    'container@/': {
                        templateUrl: '/views/item/view.html',
                        controller: 'itemController',
                        dependencies: [
                            'controllers/itemController',
                            'services/itemService'
                        ]
                    }
                }
            },
            '/.tpl.page': {
                url: "/page",
                views: {
                    'container@/': {
                        templateUrl: '/views/page/list.html',
                        controller: 'pageController',
                        dependencies: [
                            'controllers/pageController',
                            'services/pageService'
                        ]
                    }
                }
            },
            '/.tpl.pageview': {
                url: "/page/:id",
                views: {
                    'container@/': {
                        templateUrl: '/views/page/view.html',
                        controller: 'pageController',
                        dependencies: [
                            'controllers/pageController',
                            'services/pageService'
                        ]
                    }
                }
            },
            '/.tpl.user': {
                url: "/user",
                views: {
                    'container@/': {
                        templateUrl: '/views/user/list.html',
                        controller: 'userController',
                        dependencies: [
                            'controllers/userController',
                            'services/userService'
                        ]
                    }
                }
            },
            '/.tpl.userview': {
                url: "/user/:id",
                views: {
                    'container@/': {
                        templateUrl: '/views/user/view.html',
                        controller: 'userController',
                        dependencies: [
                            'controllers/userController',
                            'services/userService',
                            'directives/compare-to'
                        ]
                    }
                }
            },
            'main.login': {
                url: '/login',
                templateUrl: '/views/account/login.html',
                controller: 'accountController',
                dependencies: [
                    'controllers/accountController',
                    'services/authenticationService'
                ]
            },
            '/.tpl.about': {
                url: '/about/:person',
                views: {
                    'container@/': {
                        templateUrl: '/views/about.html',
                        controller: 'aboutController',
                        dependencies: [
                            'controllers/aboutController'
                        ]
                    }
                }
            },
            '/.tpl.contact': {
                url: '/contact',
                views: {
                    'container@/': {
                        templateUrl: '/views/contact.html',
                        controller: 'contactController',
                        dependencies: [
                            'controllers/contactController'
                        ]
                    }
                }
            }
        }
    };
});