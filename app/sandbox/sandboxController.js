(function () {
    'use strict';

    angular
        .module('app')
        .controller('sandboxController', sandboxController);

    sandboxController.$inject = ['common','$location','filegen.dataservice']; 

    function sandboxController(common,$location,dataservice) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn('sandboxController');

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'sandboxController';
        vm.submitRequest = function () {
            var request = {
                multiDay: {
                    startDate: '06/01/2015',
                    endDate: '06/23/2015',
                    fileTypes: [
                        { id: 1, name: 'ADHOC_JEN_FIPA_VALIDATION' },
                        { id: 2, name: 'ADHOC_JEN_FIPA_DELETION' }
                    ]
                },
                singleDay: {},
                portfolios: [
                    '0888_GENMILLS', '0000_TEST'
                ],
                //Pass in SecurityId
                excludedSecurities: [
                    1000,2000
                ],
                deliveryOptions: [
                    { id: 1 },
                    { id: 2 }
                ]
            };
            console.log('requesting data', request);
            dataservice.submitRequest(request).then(function (result) {
                console.log("Response is:", result);
            });
        }
        vm.submit2 = function() {
            dataservice.submitRequest().then(function (result) {
                console.log("Response is:", result);
            });
        }
        activate();

        function activate() {
            log('Sandbox Controller Activated');
        }

        
    }
})();
