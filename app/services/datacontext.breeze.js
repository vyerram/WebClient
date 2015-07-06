(function () {
    'use strict';
    var serviceId = 'datacontext.breeze';

    /* datacontext: data access and model management layer */
    angular.module('app').factory(serviceId, ['breeze', 'jsonResultsAdapter', 'common', 'model', function (breeze, jsonResultsAdapter, common, model) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);

        log('Setting up datacontext.breeze factory/service');

        var serviceName = "http://localhost:9569/v1/api/";

        var ds = new breeze.DataService({
            serviceName: serviceName,
            hasServerMetadata: false,
            useJsonp: true,
            jsonResultsAdapter: jsonResultsAdapter
        });

        var manager = new breeze.EntityManager({ dataService: ds });

        model.initialize(manager.metadataStore);

        return {
            getMakes: getMakes,
            getModels: getModels,
            getDocuments: getDocuments,
            getFileTypes: getFileTypes,
            getPortfolios: getPortfolios
        };

        /*** implementation details ***/

        function getMakes() {
            // vehicle/makerepository/findall
            var parameters = makeParameters();
            var query = breeze.EntityQuery
                .from("vehicle/makerepository/findall")
                .withParameters(parameters);
            return manager.executeQuery(query).then(returnResults);
        }

        function getModels(make) {
            // vehicle/modelrepository/findbymakeid?makeid=xxx
            var parameters = makeParameters({ makeid: make.id });
            var query = breeze.EntityQuery
                .from("vehicle/modelrepository/findbymakeid")
                .withParameters(parameters);
            return manager.executeQuery(query).then(returnResults);
        }

        function makeParameters(addlParameters) {
            var parameters = {
                fmt: "json",
                api_key: "z35zpey2s8sbj4d3g3fxsqdx"
                // Edmund throttles to 4000 requests per API key
                // get your own key: http://developer.edmunds.com/apps/register
            };
            return breeze.core.extend(parameters, addlParameters);
        }

        function getDocuments() {
            breeze.NamingConvention.camelCase.setAsDefault();
            var query = breeze.EntityQuery
                .from('documents/getall')
                .toType('DocumentMetadata');
            return manager.executeQuery(query).then(returnSimpleResults);
        }

        function returnResults(data) { return data.results; }
        function returnSimpleResults(data) {
            return data;
        }

        ////*** FileGen - GetFileTypes
        function getFileTypes() {
            var query = breeze.EntityQuery
                 .from('refdata/fileTypes')
                 .toType('FileType');
            return manager.executeQuery(query).then(returnSimpleResults);
        }
        // *** GetFileTypes END. ***

        // *** getPortfolios
        function getPortfolios() {
            var query = breeze.EntityQuery
                 .from('refdata/accounts')
                 .toType('Account');
            return manager.executeQuery(query).then(returnSimpleResults);
        }

    }]);
})();