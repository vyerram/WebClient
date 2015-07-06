(function () {
    'use strict';

    var controllerId = 'dashboarddetails';
    angular.module('app').controller(controllerId, dashboarddetails);

    function dashboarddetails(common, $scope, $modal, $http, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Dashboard Details';
        $scope.parameterDetails = {};

        //Open Download files Model window
        $scope.downloadFiles = function() {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/dashboard/dashboardFileDownload.html',
                controller: 'dashboardFileDownload',
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
            var promises = [getExecutionParameters(), getExecutionFileDetails()];

            common.activateController(promises, controllerId)
                .then(function () { log('Activated Dashboard Details View'); });
        }

        //Promise: getExecutionParameters
        function getExecutionParameters() {
            return datacontext.getExecutionParameters('8f6caf08-7ce5-4e28-abaf-6f834a41b890').then(function (data) {
                return $scope.parameterDetails = data;
            });
        }


        //Promise: getExecutionFileDetails
        function getExecutionFileDetails() {
            return datacontext.getExecutionFileDetails('8f6caf08-7ce5-4e28-abaf-6f834a41b890').then(function (data) {
                return $scope.fileDetails_Grid.data = data.filedetails;
            });
        }

        //Promise: getExecutionFileDetails
        function getExecutionActivityDetails(rowdata) {
            return datacontext.getExecutionActivityDetails(rowdata).then(function (data) {
                return $scope.fileActivity_Grid.data = data.activityDetails;
            });
        }

        //Dashboard  file details
        $scope.fileDetails_Grid = {
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            enableColumnResizing: true,
            modifierKeysToMultiSelect: false,
            minRowsToShow: 4

        };
        
        $scope.fileDetails_Grid.columnDefs = [
              { name: 'name' }, { name: 'typeName' },
              { name: 'status' }, { name: 'retryNum' },
              { name: 'startTime' }, { name: 'endTime' },
              { name: 'requester'}
        ];

        //add file register api
        $scope.fileDetails_Grid.onRegisterApi = function(gridApi) {
            //set PortfolioGridApi on scope
            $scope.fileDetailsGridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                //Get file name and refresh Activity Grid
             
                getExecutionActivityDetails(row.entity.name);
            });
        };

        //Dashboard  Activity details
        $scope.fileActivity_Grid = {
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            modifierKeysToMultiSelect: false,
            minRowsToShow: 4
        };

        $scope.fileActivity_Grid.columnDefs = [
              { name: 'activityId' }, { name: 'description' },
              { name: 'status' }, { name: 'startTime' },
              { name: 'endTime' }, { name: 'requester' },
              { name: 'action'}
        ];

    }


})();