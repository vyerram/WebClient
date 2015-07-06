(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());

    // Configure the routes and route resolvers
    app.config(['$stateProvider', '$urlRouterProvider', 'routes', routeConfigurator]);
    function routeConfigurator($stateProvider, $urlRouterProvider, routes) {

        $stateProvider.state('dashboard', {
            url: '/dashboard',
            templateUrl: 'app/dashboard/dashboard.html'
        })
            .state('detail', {
                url: '/detail',
                templateUrl: 'app/dashboard/dashboardDetails.html'
            })
            .state('documentdetail', {
                url: '/documentdetail',
                templateUrl: 'app/dashboard/documentDetails.html'
            })
            .state('sandbox', {
                url: '/sandbox',
                templateUrl: 'app/sandbox/sandbox.html'
            })
           .state('filegen', {
               url: '/filegen',
               templateUrl: 'app/filegen/filegen.html',
               controller: 'filegen'
           })
            .state('filegen.parameters', {
                url: '/parameters',
                templateUrl: 'app/filegen/filegenParameters.html'
            })
            .state('filegen.review', {
                url: '/review',
                templateUrl: 'app/filegen/filegenReview.html'
            })
              .state('filegen.summary', {
                  url: '/summary',
                  templateUrl: 'app/filegen/filegenSummary.html'
              })


        $urlRouterProvider.otherwise('/dashboard');
    }

    // Define the routes 
    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'app/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }, {
                url: '/filegen',
                config: {
                    title: 'filegen',
                    templateUrl: 'app/filegen/filegen.html',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-file-code-o"></i> Generate Files'
                    }
                }
            },
            {
                url: '/uigrid',
                config: {
                    title: 'uigrid',
                    templateUrl: 'app/uigrid/uigrid.html',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-file-code-o"></i> NG_UI Test Grid'
                    }
                }
            }
        ];
    }
})();