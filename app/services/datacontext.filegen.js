(function () {
	'use strict';

	var serviceId = 'datacontext.filegen';
	angular
	    .module('app')
	    .factory(serviceId, datacontext);

	datacontext.$inject = ['$rootScope', 'common', 'Hub'];

	function datacontext($rootScope, common, Hub) {
		var $q = common.$q;
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(serviceId);

		var hub = new Hub('data', {
			listeners: {
				'fileTypesAvailable': function (fileTypes) {
					//Documents.add(doc);
					$rootScope.$broadcast('fileTypesAvailable', fileTypes);
				}
			},
			methods: ['ready','getDeliveryTypes','getFileTypes', 'submitRequest','getAccountPortfolios','getSecurities'],
			errorHandler: function (error) {
				common.logger.logError(error);
			},
			stateChanged: function (state) {
				switch (state.newState) {
					case $.signalR.connectionState.connecting:
					    //your code here
					    console.log('Datahub connecting... you are gonna love it!.');
						break;
					case $.signalR.connectionState.connected:
						//your code here
					    console.log('The file generation hub is connected.');
					    $rootScope.$broadcast('filegen_hub_ready', hub);
						break;
					case $.signalR.connectionState.reconnecting:
					    //your code here
					    console.log('Datahub reconnecting... lets try that again!.');
						break;
					case $.signalR.connectionState.disconnected:
						//your code here
					    console.log('Oh no!! Data hub disconnected!.');
						break;
				}
			},
			logging: true
		});

        function getFileTypes() {
            var deferred = $q.defer();

            hub.promise.then(function() {
                return deferred.resolve(hub.getFileTypes());
            });
            return deferred.promise;
        }

		function getDeliveryTypes() {
		    var deferred = $q.defer();

		    hub.promise.then(function() {
		        return deferred.resolve(hub.getDeliveryTypes());
		    });
		    return deferred.promise;
		}

		function getAccountPortfolios() {
		    var deferred = $q.defer();

		    hub.promise.then(function () {
		        return deferred.resolve(hub.getAccountPortfolios());
		    });
		    return deferred.promise;
		}

		function getSecurities(dateRange, accounts) {
		    var deferred = $q.defer();

		    hub.promise.then(function () {
		        //TODO: Transform the request as appropriate
                var request = {
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate,
                    accounts:accounts
                }
		        return deferred.resolve(hub.getSecurities(request));		        
		    });
		    return deferred.promise;
		}

		function whenReady(callback) {
		    hub.promise.then(callback);
		}

        function submitRequest(request) {
            var deferred = $q.defer();

            hub.promise.then(function () {
                return deferred.resolve(hub.submitRequest(request));
            });
            return deferred.promise;
        }

		var service = {
		    hub: hub,
		    whenReady: whenReady,
            getFileTypes:getFileTypes,
            getDeliveryTypes: getDeliveryTypes,
            getAccountPortfolios: getAccountPortfolios,
            getSecurities:getSecurities,
            submitRequest:submitRequest
		};

		return service;
	}
})();