(function () {
    'use strict';

    var controllerId = 'documentdetails';
    angular.module('app').controller(controllerId, documentdetails);

    function documentdetails(common, $scope, $modal, $http, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'document Details';
        $scope.parameterDetails = {};

        //Open Download files Model window
        $scope.downloadFiles = function() {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/dashboard/documentFileDownload.html',
                controller: 'documentFileDownload',
                backdrop:false,
                resolve: {
                    items: function () {
                        return $scope.fileDetailsGridApi.selection.selectAllRows();
                    }
                }
            });
        }
        
        activate();
        function activate() {
            //Resolve Promises
            var promises = [getDocumentDetails()];

            common.activateController(promises, controllerId)
                .then(function () { log('Activated Dashboard Details View'); });
        }

        ////Promise: getDocumentParameters
        //function getDocumentParameters() {
        //    return datacontext.getDocumentParameters('8f6caf08-7ce5-4e28-abaf-6f834a41b890').then(function (data) {
        //        return $scope.parameterDetails = data;
        //    });
        //}

        //Promise: getDocumentDetails
        function getDocumentDetails(rowdata) {
            return datacontext.getDocumentDetails(rowdata).then(function (data) {
                return $scope.documentDetails_Grid.data = data.documentDetail;
            });
        }

        //Dashboard  file details
        $scope.documentDetails_Grid = {
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            enableColumnResizing: true,
            modifierKeysToMultiSelect: false,
            minRowsToShow: 4
        };
        
        $scope.documentDetails_Grid.columnDefs = [
              { name: 'id' }, { name: 'name' },
              { name: 'docversion' }, { name: 'dateCreated' },
              { name: 'dateModified' }, { name: 'owner'}
        ];

        //add file register api
        $scope.documentDetails_Grid.onRegisterApi = function (gridApi) {
            //set PortfolioGridApi on scope
            $scope.documentDetailsGridApi = gridApi;
        };
    }
})();