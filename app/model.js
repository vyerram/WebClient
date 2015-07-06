(function () {
    'use strict';
    var serviceId = 'model';

    /* model: entity definitions */
    angular.module('app').factory(serviceId, ['common', function (common) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);

        var DT = breeze.DataType; // alias
        return {
            initialize: initialize
        }

        function initialize(metadataStore) {
            log('Initialize called');
            metadataStore.addEntityType({
                shortName: "DocumentMetadata",
                namespace: "JA.FIPA.Contracts",
                dataProperties: {
                    id: { dataType: DT.Guid, isPartOfKey: true },
                    name: { dataType: DT.String },
                    version: { dataType: DT.Int32 },
                    dateCreated: { dataType: DT.DateTimeOffset },
                    dateModified: {dataType: DT.DateTimeOffset},
                    owner: { dataType: DT.String }
                }
            });

            metadataStore.addEntityType({
                shortName: "DataDocument",
                namespace: "JA.FIPA.Contracts",
                dataProperties: {
                    Id: { dataType: DT.Guid, isPartOfKey: true },
                    Name: { dataType: DT.String },
                    Version: { dataType: DT.Int32 },
                    DateCreated: { dataType: DT.DateTimeOffset },
                    DateModified: { dataType: DT.DateTimeOffset },
                    Owner: { dataType: DT.String }
                }
            });
            metadataStore.addEntityType({
                shortName: "FileType",
                namespace: "JA.FIPA.Contracts",
                dataProperties: {
                    id: { dataType: DT.Int32, isPartOfKey: true },
                    name: { dataType: DT.String },
                    allowsMultiDay: { dataType: DT.Boolean },
                    isAdhoc: { dataType: DT.Boolean },
                    sortOrder: { dataType: DT.Int32 }
                  
                }
            });
            metadataStore.addEntityType({
                shortName: "Account",
                namespace: "JA.FIPA.Contracts",
                dataProperties: {
                    id: { dataType: DT.Int32, isPartOfKey: true },
                    accountCode: { dataType: DT.String },
                    accountName: { dataType: DT.String },
                    portfolioCode: { dataType: DT.String },
                    portfolioName: { dataType: DT.String },
                    startDate: {dataType:DT.String},
                    sequenceNumber: { dataType: DT.Int32 }
                }
            });

        }
    }]);

})();