(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId,
		['common', '$scope', '$http', '$state', 'datacontext', 'datacontext.breeze', dashboard]);

    function dashboard(common, $scope, $http, $state, datacontext, datastore) {
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Dashboard';
        vm.messageCount = 0;
        vm.documents = [];

        $scope.documentsFilterValue = '';
        $scope.activitySummaryFilterValue = '';

        activate();
        function activate() {
            var promises = [getExecutionSummary(), getMessageCount(), getDocuments()];
            common.activateController(promises, controllerId).then(function () {

                log('Activated Dashboard View');
                //datastore.viewActivated('dashboard');
            });
        }

        function queryFailed(error) {
            common.logger.logError(error.message, "Query failed; please try it again.");
        }

        function getMessageCount() {
            return datacontext.getMessageCount().then(function (data) {
                return vm.messageCount = data;
            });
        }
        function getExecutionSummary() {
            return datacontext.getExecutionSummary().then(function (data) {
                return $scope.DashboardLkup_Grid.data = data;
            });
        }

        function getDocuments() {
            log('Fetching documents from datastore');
            var promise = datastore.getDocuments().then(succeeded);

            function succeeded(results) {
                log('Documents retrieved successfully');
                $scope.theDocuments = results.results;
                $scope.documentsLkup_Grid.data = $scope.theDocuments;
            }

            return promise;
        }

        function setDocuments(docs) {
            console.log('[Dashboard:setDocuments(docs)] called');
            var documents = [];
            docs.forEach(function (d) {
                documents.push(d);
            });
            console.log('[Dashboard:setDocuments(docs)] populated documents...');
            console.log(documents);
            $scope.documentsLkup_Grid.data = documents;
        }

        function getAllDocuments() {
            return documents.retrieve().then(function (data) {
                setDocuments(data);
            });
        }

        //Dashboard- Execution Summary 
        $scope.DashboardLkup_Grid = {
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            enableColumnResizing: true,
            modifierKeysToMultiSelect: false,
            minRowsToShow: 7
        };

        $scope.DashboardLkup_Grid.columnDefs = [
		{
		    name: 'id', visible: false
		},
				{
				    name: 'name',
				    cellTemplate: '<a ng-click=grid.appScope.getExecutionDetail("{{row.entity.id}}")>{{row.entity.name}}</a>'
				},
				{
				    name: 'status',
				    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
				        if (grid.getCellValue(row, col).indexOf('Failed') > -1) {
				            return 'red';
				        } else if (grid.getCellValue(row, col).indexOf('Success') > -1)
				            return 'green';
				        else {
				            return 0;
				        }
				    }
				},
					{ name: 'startDate' },
					{ name: 'endDate' },
					{ name: 'requester' }
        ];


        //Activity Summary search feature
        // define involved search columns for activitysummary.
        $scope.DashboardLkup_Grid.onRegisterApi = function (dashboardLkupGridApi) {
            $scope.dashboardLkupGridApi = dashboardLkupGridApi;
            $scope.dashboardLkupGridApi.grid.registerRowsProcessor($scope.searchFilter, 200);
        };

        $scope.activitySummaryColsFilter = ['name', 'status', 'startDate', 'endDate', 'requester'];
        $scope.colsFilter = [];

        //Scope filter
        $scope.colsFilter = $scope.activitySummaryColsFilter;
        //ActivityFilter code
        $scope.activitySummaryFilter = function () {

            $scope.dashboardLkupGridApi.grid.refresh();
        };

        $scope.searchFilter = function searchFilter(renderableRows) {
            var matcher = new RegExp($scope.activitySummaryFilterValue,'i');
            renderableRows.forEach(function (row) {
                var match = false;
                $scope.colsFilter.forEach(function (field) {
                    if (row.entity[field].match(matcher)) {
                        match = true;
                    }
                });
                if (!match) {
                    row.visible = false;
                }
            });
            return renderableRows;


        };
        //---ActivitySummary search ends

        //Documents Summary Begins
        $scope.documentsLkup_Grid = {
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            enableColumnResizing: true,
            modifierKeysToMultiSelect: false,
            minRowsToShow: 7
        };

        $scope.documentsLkup_Grid.columnDefs = [
		{
		    name: 'id', visible: false
		},
				{
				    name: 'name',
				    cellTemplate: '<a ng-click=grid.appScope.getDocumentDetail("{{row.entity.id}}")>{{row.entity.name}}</a>'

				},
					{ name: 'version' },
					{ name: 'dateCreated' },
					{ name: 'dateModified' },
					{ name: 'owner' }
        ];

        function getDocumentsData() {
            return datacontext.getDocumentsData().then(function (data) {
                return $scope.documentsLkup_Grid.data = data;
            });
        }

        //Documents search feature
        $scope.documentsLkup_Grid.onRegisterApi = function (documentsLkupApi) {
            $scope.documentsLkupApi = documentsLkupApi;
            $scope.documentsLkupApi.grid.registerRowsProcessor($scope.documentssearchFilter, 200);
        };

        $scope.documentsColsFilter = ['name', 'version', 'owner', 'dateCreated', 'dateModified'];
        $scope.docColsFilter = $scope.documentsColsFilter;

        //ActivityFilter code
        $scope.documentsFilter = function () {
            $scope.documentsLkupApi.grid.refresh();
        };

        $scope.documentssearchFilter = function documentssearchFilter(renderableRows) {
            var matcher = new RegExp($scope.documentsFilterValue,'i');
            renderableRows.forEach(function (row) {
                var match = false;
                $scope.docColsFilter.forEach(function (field) {
                    var propertyValue = '' + row.entity[field];
                    if (propertyValue.match(matcher)) {
                        match = true;
                    }
                });
                if (!match) {
                    row.visible = false;
                }
            });
            return renderableRows;


        };

        $scope.getExecutionDetail = function (myVal) {
            $state.go('detail');
        }

        $scope.getDocumentDetail = function (myVal) {
            //Move to DashboardDetail page.
            $state.go('documentdetail');
        }

        //$scope.$on('datastore_documentsChanged', function (event, docs) {
        //	docs.toArray(function (theDocs) {
        //		console.log('[Dashboard] Documents were changed')
        //		console.log(theDocs);
        //		$scope.$apply(function () {
        //			setDocuments(theDocs);
        //		});
        //	});;
        //});


    }
})();