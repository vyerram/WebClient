﻿(function () {
    'use strict';

    // needs to be made avail to breeze.dataService.xxx files
    //ctor.normalizeTypeName = __memoize(function (rawTypeName) {
    //    return rawTypeName && parseTypeName(rawTypeName).typeName;
    //});

    var ANONTYPE_PREFIX = '_IB_';

    function __stringStartsWith(str, prefix) {
        // returns true for empty string or null prefix
        if ((!str)) return false;
        if (prefix == "" || prefix == null) return true;
        return str.indexOf(prefix, 0) === 0;
    }


    function qualifyTypeName(shortName, namespace) {
        if (namespace && namespace.length > 0) {
            return shortName + ":#" + namespace;
        } else {
            return shortName;
        }
    }

    function makeTypeHash(shortName, namespace) {
        return {
            shortTypeName: shortName,
            namespace: namespace,
            typeName: qualifyTypeName(shortName, namespace)
        };
    }

    function parseTypeName(entityTypeName) {
        if (!entityTypeName) {
            return null;
        }

        var typeParts = entityTypeName.split(":#");
        if (typeParts.length > 1) {
            return makeTypeHash(typeParts[0], typeParts[1]);
        }

        if (__stringStartsWith(entityTypeName, ANONTYPE_PREFIX)) {
            var typeHash = makeTypeHash(entityTypeName);
            typeHash.isAnonymous = true;
            return typeHash;
        }
        var entityTypeNameNoAssembly = entityTypeName.split(",")[0];
        var typeParts = entityTypeNameNoAssembly.split(".");
        if (typeParts.length > 1) {
            var shortName = typeParts[typeParts.length - 1];
            var namespaceParts = typeParts.slice(0, typeParts.length - 1);
            var ns = namespaceParts.join(".");
            return makeTypeHash(shortName, ns);
        } else {
            return makeTypeHash(entityTypeName);
        }
    }

    function normalizeTypeName(rawTypeName) {
        return rawTypeName && parseTypeName(rawTypeName).typeName;
    };

    /* jsonResultsAdapter: parses Edmunds data into entities */
    angular.module('app').value('jsonResultsAdapter',
        new breeze.JsonResultsAdapter({

            name: "fipaDynamic",

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
                //// Make parser
                //if (node.id && node.models) {
                //    // move 'node.models' links so 'models' can be empty array
                //    node.modelLinks = node.models;
                //    node.models = [];
                //    return { entityType: "Make" }
                //}

                //    // Model parser
                //else if (node.id && node.makeId) {
                //    // move 'node.make' link so 'make' can be null reference
                //    node.makeLink = node.make;
                //    node.make = null;

                //    // flatten styles and sizes as comma-separated strings
                //    var styles = node.categories && node.categories["Vehicle Style"];
                //    node.vehicleStyles = styles && styles.join(", ");
                //    var sizes = node.categories && node.categories["Vehicle Size"];
                //    node.vehicleSizes = sizes && sizes.join(", ");

                //    return { entityType: "Model" };
                //}

                // Return the doc
                var entityType = normalizeTypeName(node.$type);
                var shortName = entityType.split(':#')[0];
                var propertyName = nodeContext.propertyName;
                var ignore = propertyName && propertyName.substr(0, 1) === "$";

                return {
                    entityType: shortName,
                    //nodeId: node.$id,
                    //nodeRefId: node.$ref,
                    ignore: ignore
                };
            }

        }));


})();