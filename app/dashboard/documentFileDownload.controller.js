(function () {
    'use strict';

    var controllerId = 'dashboardFileDownload';
    angular.module('app').controller(controllerId, dashboardFileDownload);

    function dashboardFileDownload(common, $scope, $http, $interval,  datacontext) {
        
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        $scope.gridoptions = {
            enableRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 35,
            rowHeight: 30,
            showGridFooter: false,
            minRowsToShow: 10
        };

        $scope.gridoptions.columnDefs = [
            { name: 'Files', field: 'typeName' }
        ];
   
        $scope.gridoptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
        };
 
        //Promise: Has to change
        function getExecutionFileDetails() {
            return datacontext.getExecutionFileDetails('8f6caf08-7ce5-4e28-abaf-6f834a41b890').then(function (data) {
                return $scope.gridoptions.data = data.filedetails;
            });
        }

        $http.get('http://ui-grid.info/data/500_complex.json')
           .success(function (data) {
               getExecutionFileDetails();
           });

        $scope.isDownload = false;

        //Confirm Click--file download
        $scope.confirm = function()
        {
            $scope.isDownload = true;
            $interval(function () { $scope.isDownload = false; }, 5000, 1, false);
        }

        $scope.cancel = function()
        {
            angular.element("body").removeClass("modal-open");
            angular.element(".modal").hide();

           
        }
       
    }
})();