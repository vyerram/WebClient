//Todo: Check if third party elements are using $scope by default. 
//Convert scope to vm if there are no conflicts.
(function () {
    'use strict';

    var controllerId = 'filegen';
    angular.module('app')
        .controller(controllerId, ['common', '$state', '$filter', '$scope', '$http', '$log', '$timeout', 'datacontext', 'uiGridConstants', filegen]);

    function filegen(common, $state, $filter, $scope, $http, $log, $timeout, datacontext, uiGridConstants) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var self = this;
        //Page vm attributes
        $scope.inputModel = {
            requestId: null,
//            multiDay: {
//                startDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
//                endDate: $filter('date')(new Date(), 'yyyy-MM-dd')
//            }, 
            multiDay: {
                startDate: null,
                endDate: null
            },

            singleDay: {
                startDate: null,
                endDate: null
            },
            fileTypes: null,
            deliveryTypes: null,
            deliveryOptions: null,
            portfolioFilterValue: undefined,
            validation: {
                //Date and Day Flags
                mdDirtyFlag: 0,
                sdDirtyFlag: 0,
                mdFTDirtyFlag: 0,
                sdFTDirtyFlag: 0,
                isInvalid: 0,
                invalidMessage: []
            }
        };

        var inputModel = $scope.inputModel;

        //option to display single calendar.
        $scope.singleDayOpts = {
            singleDatePicker: true
        }


        //Retain page state between wizard steps
        if (!angular.isDefined($scope.isViewState)) {
            activate();

            // define involved search columns for tables.
            $scope.portfolioColsFilter = ['accountCode', 'accountName', 'portfolioCode', 'portfolioName', 'startDate'];
            $scope.colsFilter = [];

            // portfolioLkup_Grid initialization
            $scope.portfolioLkup_Grid = {
                enableRowSelection: true,
                allowColumnResizing: true,
                enableSelectAll: true,
                selectionRowHeaderWidth: 35,
                rowHeight: 30,
                showGridFooter: false,
                minRowsToShow: 4
            };

            $scope.portfolioLkup_Grid.columnDefs = [{
                name: 'accCode',
                field: 'accountCode'
            }, {
                name: 'accName',
                field: 'accountName',
                sort: {
                    direction: uiGridConstants.ASC,
                    priority: 1
                }
            }, {
                name: 'portfolioCode'
            }, {
                name: 'portfolioName'
            }, {
                name: 'startDate'
            }, {
                name: 'exists'
            }];

            $scope.portfolioLkup_Grid.onRegisterApi = function (PortfolioGridApi) {
                $scope.portFolioLkpGridApi = PortfolioGridApi;
                $scope.portFolioLkpGridApi.grid.registerRowsProcessor($scope.searchFilter, 200);
            };

            $scope.colsFilter = $scope.portfolioColsFilter;
            //portfolioFilter code
            $scope.portfolioFilter = function () {

                $scope.portFolioLkpGridApi.grid.refresh();
            };

            $scope.searchFilter = function searchFilter(renderableRows) {
                var strValue = inputModel.portfolioFilterValue;
                var matcher = new RegExp(strValue);
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

            //portfolioSelected_Grid Grid initialization
            $scope.portfolioSelected_Grid = {
                enableRowSelection: true,
                enableSelectAll: true,
                selectionRowHeaderWidth: 35,
                rowHeight: 30,
                showGridFooter: false,
                minRowsToShow: 4
            };

            $scope.portfolioSelected_Grid.columnDefs = [{
                name: 'portfolioCode'
            }, {
                name: 'portfolioName'
            }];

            $scope.portfolioSelected_Grid.onRegisterApi = function (portfolioSelectiedGridApi) {
                $scope.portfolioSelectiedGridApi = portfolioSelectiedGridApi;
            };

            $scope.isViewState = true;
        }

        function activate() {
            //Get portfolioLkup_Grid  promises and activate the controller
            var promises = [getAccountPortfolios(), getFileTypes(), getDeliveryTypes()];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated File Generation View');
                })
                .catch(function (error) {
                    log('Error while activating:', error);
                });
        }

        // Securities Grid
        $scope.SecuritiesExclusion_Grid = {
            enableRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 35,
            rowHeight: 30,
            showGridFooter: false,
            minRowsToShow: 4
        };

        $scope.SecuritiesExclusion_Grid.columnDefs = [{
            name: 'securityCode'
        }, {
            name: 'securityName'
        }, {
            name: 'accountCode',
            visible: 'false'
        }];

        $scope.SecuritiesExclusion_Grid.onRegisterApi = function (securitiesExclusionGrid) {
            $scope.securitiesExclusionGridApi = securitiesExclusionGrid;

        };

        // Securities Exclusion Review Grid
        $scope.SecuritiesExclusion_Rev_Grid = {
            enableRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 35,
            rowHeight: 30,
            showGridFooter: false,
            minRowsToShow: 4
        };

        $scope.SecuritiesExclusion_Rev_Grid.columnDefs = [{
            name: 'securityCode'
        }, {
            name: 'securityName'
        }, {
            name: 'accountCode',
            visible: 'false'
        }];

        $scope.SecuritiesExclusion_Rev_Grid.onRegisterApi = function (securitiesExclusionRevGrid) {
            $scope.securitiesExclusionRevGridApi = securitiesExclusionRevGrid;
            $scope.SecuritiesExclusion_Rev_Grid.data = $scope.securitiesExclusionGridApi.selection.getSelectedRows();
        };

        //--- New File Types -----
        function getFileTypes() {
            //log('Fetching fileTypes from breeze');
            return datacontext.getFileTypes().then(function (data) {
                $scope.inputModel.fileTypes = data;
                angular.forEach($scope.inputModel.fileTypes.singleDay, function (val) {
                    val.checkVal = '';
                });
                angular.forEach($scope.inputModel.fileTypes.multiDay, function (val) {
                    val.checkVal = '';
                });


            });
        }

        //Filetype Filter
        $scope.checkValFilter = function (val) {
            return val.checkVal === true;
        }

        //Delivery filter
        $scope.deliveryValFilter = function (val) {
            return val.checkVal === true;
        }

        //--- End FileTypes -----

        //--- New Delivery Types -----
        function getDeliveryTypes() {
            //log('Fetching delivery types from server');
            return datacontext.getDeliveryTypes().then(function (data) {
                //add checkVal for tracking
                angular.forEach(data, function (val) {
                    val.checkVal = '';
                });
                $scope.inputModel.deliveryTypes = data;
            });
        }

        function getAccountPortfolios() {
            //log('Fetching delivery types from server');
            return datacontext.getAccountPortfolios().then(function (data) {
                $scope.inputModel.portfolios = data;
                $scope.portfolioLkup_Grid.data = data;
            });
        }
        //--- End DeliveryTypes -----

        //Move selected portfolios to selected List.
        $scope.addSelected = function () {

            $scope.selectedPortfolioRows = $scope.portFolioLkpGridApi.selection.getSelectedRows();

            angular.forEach($scope.selectedPortfolioRows, function (data, index) {
                $scope.portfolioLkup_Grid.data.splice($scope.portfolioLkup_Grid.data.lastIndexOf(data), 1);
            });

            $scope.portfolioSelected_Grid.data = $scope.portfolioSelected_Grid.data.concat($scope.selectedPortfolioRows);

            //fetch securities using portfolio list.
            var dateRange = self.getSelectedDateRange();
            var accounts = $scope.selectedPortfolioRows;
            $scope.excludedSecurities = datacontext.getSecurities(dateRange, accounts).then(function (data) {
                $scope.SecuritiesExclusion_Grid.data = $scope.SecuritiesExclusion_Grid.data.concat(data);
            });

        }

        //remove portfolios from selected list
        $scope.removeSelected = function () {
            //Remove selected rows
            $scope.unselectPortfolioRows = null;
            $scope.unselectPortfolioRows = $scope.portfolioSelectiedGridApi.selection.getSelectedRows();

            angular.forEach($scope.unselectPortfolioRows, function (data, index) {
                $scope.portfolioSelected_Grid.data.splice($scope.portfolioSelected_Grid.data.lastIndexOf(data), 1);

                //Remove all securities tied to unselected accounts
                var securityRows = $scope.SecuritiesExclusion_Grid.data.filter(function (val) {
                    return val.accountCode === data.accountCode;
                });

                //takesecurityRows and remove them from grid
                angular.forEach(securityRows, function (data1, index1) {
                    $scope.SecuritiesExclusion_Grid.data.splice(data1);
                });

            });
            $scope.portfolioLkup_Grid.data = $scope.portfolioLkup_Grid.data.concat($scope.unselectPortfolioRows);
        }


        //Single day and Multi day Mutual exclusion
        $scope.resetSingleDay = function (mVal) {
            angular.forEach($scope.inputModel.fileTypes.singleDay, function (key) {

                if (mVal.name === key.name) {
                    key.checkVal = false;
                }
            });
        }

        $scope.resetMultiDay = function (mVal) {
            angular.forEach($scope.inputModel.fileTypes.multiDay, function (key) {

                if (mVal.name === key.name) {

                    key.checkVal = false;
                }
            });
        }

        /// <summary>
        /// Get the broadest range from the given ranges        
        /// </summary>
        self.getBroadestDateRange = function (range1, range2) {
            var startDate = range1.startDate;
            var endDate = range2.endDate;
            if (!startDate) {
                startDate = range2.startDate;
            } else {
                if (range2.startDate < startDate) {
                    startDate = range2.startDate;
                }
            }

            if (!endDate) {
                endDate = range2.endDate;
            } else {
                if (range2.endDate > endDate) {
                    endDate = range2.endDate;
                }
            }

            return {
                startDate: startDate,
                endDate: endDate
            };
        }

        self.getSelectedDateRange = function () {
            var mdDateRange = {
                startDate: $scope.inputModel.multiDay.startDate,
                endDate: $scope.inputModel.multiDay.endDate
            };

            var sdDateRange = {
                startDate: $scope.inputModel.singleDay.startDate,
                endDate: $scope.inputModel.singleDay.endDate
            }

            var dateRange = self.getBroadestDateRange(mdDateRange, sdDateRange);
            return dateRange;
        }


        //validation decision table
        //Todo: move this to constant
        var validationTbl = [];
        validationTbl["0000"] = "Select Multi-Day and/or Single Day";
        validationTbl["0001"] = "Select Single Day Date Value";
        validationTbl["0010"] = "Select Single Day File Type";
        validationTbl["0011"] = "Valid";
        validationTbl["0100"] = "Select Multi-Day Date value";
        validationTbl["0101"] = "Select Multi-Day and Single Day Date";
        validationTbl["0110"] = "Select Multi-Day Date and Single Day File Type";
        validationTbl["0111"] = "Select Multi-Day Date";
        validationTbl["1000"] = "Select Multi-Day FileType";
        validationTbl["1001"] = "Select Multi-Day FileType and Single Day Date";
        validationTbl["1010"] = "Select Multi-Day and Single Day file Type";
        validationTbl["1011"] = "Select Multi-Day File Type";
        validationTbl["1100"] = "Valid";
        validationTbl["1101"] = "Select Single Day Date";
        validationTbl["1110"] = "Select Single Day File Type";
        validationTbl["1111"] = "Valid";

        //Form Validation Before Submission
        $scope.validateForm = function () {

            $scope.inputModel.validation.isInvalid = true;
            $scope.inputModel.validation.invalidMessage = [];
            //Single and multiday date values
            $scope.inputModel.validation.mdDirtyFlag = $scope.filegenForm.multiDay.$dirty;
            $scope.inputModel.validation.sdDirtyFlag = $scope.filegenForm.singleDay.$dirty;
            
            //special case:  where date is selected and simultaneously deleted.
            if($scope.inputModel.multiDay.startDate ===null )
                {
                    $scope.inputModel.validation.mdDirtyFlag = 0;
                }
            if($scope.inputModel.singleDay.startDate ===null )
                {
                    $scope.inputModel.validation.sdDirtyFlag = 0;
                }
            $scope.inputModel.validation.mdFTDirtyFlag = 0;
            $scope.inputModel.validation.sdFTDirtyFlag = 0;

            angular.forEach($scope.inputModel.fileTypes.multiDay, function (key) {
                if (key.checkVal) {
                    $scope.inputModel.validation.mdFTDirtyFlag = 1;
                }
            });

            angular.forEach($scope.inputModel.fileTypes.singleDay, function (key) {

                if (key.checkVal) {
                    $scope.inputModel.validation.sdFTDirtyFlag = 1;
                }
            });

            $scope.inputModel.validation.mdDirtyFlag = ($scope.inputModel.validation.mdDirtyFlag & 1).toString();
            $scope.inputModel.validation.mdFTDirtyFlag = ($scope.inputModel.validation.mdFTDirtyFlag).toString();
            $scope.inputModel.validation.sdDirtyFlag = ($scope.inputModel.validation.sdDirtyFlag & 1).toString();
            $scope.inputModel.validation.sdFTDirtyFlag = ($scope.inputModel.validation.sdFTDirtyFlag).toString();

            var finalString = $scope.inputModel.validation.mdDirtyFlag.concat(
                $scope.inputModel.validation.mdFTDirtyFlag, $scope.inputModel.validation.sdDirtyFlag,
                $scope.inputModel.validation.sdFTDirtyFlag);

            //check if all values are present and allow to transition.
            if ($scope.filegenForm.$pristine) {
                $scope.inputModel.validation.invalidMessage.push('Minimum of one Date/FileType value');
                $scope.inputModel.validation.invalidMessage.push('Minimum of one portfolio code');
                $scope.inputModel.validation.invalidMessage.push('Minimum of one delivery option');

                event.preventDefault();
            } else {

                if (validationTbl[finalString] != "Valid") {
                    $scope.inputModel.validation.invalidMessage.push(validationTbl[finalString]);
                }

                //check portfolio and Delivery values
                var cntDeliveryType = 0;

                if ($scope.portfolioSelected_Grid.data.length === 0) {
                    $scope.inputModel.validation.invalidMessage.push("Select Portfolio")
                }

                angular.forEach($scope.inputModel.deliveryTypes, function (val) {
                    if (val.checkVal === true) {
                        cntDeliveryType++;
                    }
                });

                if (cntDeliveryType === 0) {
                    $scope.inputModel.validation.invalidMessage.push("Select Delivery Type")
                }

                if ($scope.inputModel.validation.invalidMessage.length > 0) {
                    $scope.inputModel.validation.isInvalid = true;
                    event.preventDefault();

                } else {
                    $scope.inputModel.validation.isInvalid = false;
                    angular.element('#filegenSel').removeClass('current');
                    angular.element('#filegenSum').removeClass('current');
                    angular.element('#filegenRev').addClass('current');

                    $state.go('filegen.review');
                }
            }

            //Summary Wizard Step
            $scope.filegenSummaryClick = function () {
                var request = {
                    MultiDay: $scope.inputModel.multiDay,
                    SingleDay: $scope.inputModel.singleDay,
                    MultiDayFileTypes: [],
                    SingleDayFileTypes: [],
                    DeliveryTypes: [],
                    Portfolios: [],
                    ExcludedSecurities: []

                };

                angular.forEach($scope.inputModel.fileTypes.multiDay, function (val) {
                    if (val.checkVal === true) {
                        request.MultiDayFileTypes.push(val);
                    }

                });

                angular.forEach($scope.inputModel.fileTypes.singleDay, function (val) {
                    if (val.checkVal === true) {
                        request.SingleDayFileTypes.push(val);
                    }

                });

                angular.forEach($scope.inputModel.deliveryTypes, function (val) {
                    if (val.checkVal === true) {
                        request.DeliveryTypes.push(val);
                    }
                });

                // $scope.portfolioSelected_Grid.data
                angular.forEach($scope.portfolioSelected_Grid.data, function (data, index) {
                    request.Portfolios.push(data);
                });

                angular.forEach($scope.SecuritiesExclusion_Rev_Grid.data, function (data, index) {
                    request.ExcludedSecurities.push(data);
                });

                datacontext.submitRequest(request).then(function (result) {
                    var requestId = result.requestId;
                    $scope.inputModel.requestId = requestId;
                    console.log('Request received by server', result);

                    angular.element('#filegenSel').removeClass('current');
                    angular.element('#filegenSum').addClass('current');
                    angular.element('#filegenRev').removeClass('current');

                    $state.go('filegen.summary');
                });
            }

            //filegenParameters Wizard Step
            $scope.filegenParamClick = function () {
                $scope.inputModel.validation.isInvalid = false;

                angular.element('#filegenSel').addClass('current');
                angular.element('#filegenSum').removeClass('current');
                angular.element('#filegenRev').removeClass('current');

                $scope.excludedSecurities = datacontext.getSecurities($scope.selectedPortfolioRows).then(function (data) {
                    $scope.SecuritiesExclusion_Grid.data = $scope.SecuritiesExclusion_Grid.data.concat(data);
                });

                $scope.inputModel.validation.mdFTDirtyFlag = 0;
                $scope.inputModel.validation.sdFTDirtyFlag = 0;

                $state.go('filegen.parameters');

            }

        }
    }
})();
