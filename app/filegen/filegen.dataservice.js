(function () {
    'use strict';

    var serviceId = 'filegen.dataservice';
    var instanceCnt = 0;
    angular
    .module('app')
    .service(serviceId, ['common', 'datacontext.filegen', function (common, datacontext) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);

        log('File Gen dataservice started', instanceCnt++);
        this.getFileTypes = getFileTypes;
        this.getDeliveryTypes = getDeliveryTypes;
        this.submitRequest = submitRequest;
        this.getAccountPortfolios = getAccountPortfolios;
        this.getSecurities = getSecurities;
        function getFileTypes() {
            var deferred = $q.defer();
            log('Fetching fileTypes from breeze');
            datacontext.getFileTypes().then(function (results) {
                log('Filetypes retrieved successfully', results);
                var all = results;
                var fileTypes = {
                    multiDay: [],
                    singleDay: []
                };
                all.forEach(function (fileType) {
                    if (fileType.allowsMultiDay === true) {
                        fileTypes.multiDay.push({
                            name: fileType.name,
                            value: fileType.id,
                            supportsDateRange: fileType.allowsMultiDay,
                            isAdhoc: fileType.isAdhoc,
                            sortOrder: fileType.sortOrder
                        });
                    }

                    fileTypes.singleDay.push({
                        name: fileType.name,
                        value: fileType.id,
                        supportsDateRange: fileType.allowsMultiDay,
                        isAdhoc: fileType.isAdhoc,
                        sortOrder: fileType.sortOrder
                    });
                });

                deferred.resolve(fileTypes);
            });

            return deferred.promise;
        }

        function getDeliveryTypes() {
            return datacontext.getDeliveryTypes();
        }

        function getAccountPortfolios() {
            return datacontext.getAccountPortfolios();
        }

        function submitRequest(request) {
            console.log('[submitRequest] request:', request);
            return datacontext.submitRequest(request);
        }

        function getSecurities(dateRange, accounts) {
            return datacontext.getSecurities(dateRange, accounts);
        }
    }]);

})();