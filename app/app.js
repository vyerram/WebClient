(function () {
    'use strict';
    
    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        //'ngRoute',          // routing
         'ui.router',
        'ngSanitize',
        'ngResource',// sanitizes html bindings (ex: sidebar.js)
        'ngTouch',
        'ui.grid',
        'ui.grid.selection',
        'ui.grid.cellNav', 
        'ui.grid.resizeColumns',
        // Custom modules 
        'common',           // common functions, logger, spinner
        'common.bootstrap', // bootstrap dialog wrapper functions

        // 3rd Party Modules
        'ui.bootstrap',     // ui-bootstrap (ex: carousel, pagination, dialog)
        'daterangepicker',
        'SignalR',
        'breeze.angular'
    ]);
  
    // Handle routing errors and success events
    app.run(['$state',  function ($state) {
            // Include $route to kick start the router.
        }]);        
})();