(function () {
    'use strict';

    /* jsonResultsAdapter: parses Edmunds data into entities */
    angular.module('app').value('jsonResultsAdapter',
        new breeze.JsonResultsAdapter({

            name: "fipa",

            extractResults: function (data) {
                //console.log('Extracting results');
                var results = data.results;
                //console.log('here');
                if (!results) throw new Error("Unable to resolve 'results' property");
                //if ( results === null || results === {} || results === '' || results === undefined || !results) {
                //    console.log('Extracting data');
                //    return data;
                //}
                //// Parse only the make and model types
                //return results && (results.makeHolder || results.modelHolder);
                return results;
            },

            visitNode: function (node, parseContext, nodeContext) {                
                // Return the doc
                var shortName = parseContext.query.resultEntityType.shortName;

                return {
                    entityType: shortName
                //nodeId: node.$id,
                //nodeRefId: node.$ref,
                //ignore: ignore
                };
            }

        }));


})();