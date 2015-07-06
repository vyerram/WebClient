(function () {
    'use strict';

    var controllerId = 'topnav';
    angular.module('app').controller(controllerId,
        ['$state', 'config', 'routes', 'datacontext.filegen', sidebar]);

    function sidebar($route, config, routes, fsDataContext) {
        var vm = this;

        //vm.isCurrent = isCurrent;

        activate();

        function activate() {


        }

        function refresh() {

        }
    };
})();
