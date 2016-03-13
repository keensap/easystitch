'use strict';
require.config({
	baseUrl: '/',
	paths: {
		'angular': '/scripts/angular-1.4.8/angular',
		'ui-router': '/scripts/angular-ui-router-0.2.15/angular-ui-router',
		'bootstrap': '/scripts/bootstrap-3.3.6/bootstrap',
		'ui-bootstrap': '/scripts/ui-bootstrap-1.1.0/ui-bootstrap-tpls-1.1.0',
		'angular-animate': '/scripts/angular-1.4.8/angular-animate',
		'cookies': 'scripts/angular-1.4.8/angular-cookies',

		'jquery': 'scripts/jquery-2.2.0/jquery',

		'chart': '/scripts/angular-chart-0.8.8/chart',
		'angular-chart': '/scripts/angular-chart-0.8.8/angular-chart',
		
		'data-utils': '/common/data-utils',
		'utils': '/common/utils',
		'global': '/common/global',

		'app': '/config/app',
		'routes': '/config/routes',
		'interceptor': '/services/tokenInterceptor',

		'logger': '/common/logger'
	},
	shim: {
		'app': {
			deps: ['angular', 'ui-router', 'ui-bootstrap', 'cookies', 'jquery', 'global', 'data-utils', 'utils', 'angular-chart', 'logger'] 
		},
		'ui-router': {
			deps: ['angular']
		},
		'angular-route': {
			deps: ['angular']
		},
		'ui-bootstrap': {
			deps: ['angular', 'angular-animate']
		},
		'cookies':{
			deps: ['angular']
		},
		'angular-animate': {
			deps: ['angular']
		},
		'angular-chart': {
			deps: ['angular', 'chart']
		},
		'logger': {
			deps: ['angular']   
		},
		'utils': {
			deps: ['angular']
		}
	}
});

require
(
	['app'],
	function(app)
	{
		angular.bootstrap(document, ['ngAnimate', 'ui.bootstrap', 'ngCookies', 'chart.js', 'app']);
	}
);