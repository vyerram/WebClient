(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId, ['common', '$http', datacontext]);

    function datacontext(common, $http) {
        var $q = common.$q ,
            //serviceName = "http://localhost:9569/v1/api",
            service = {
            //Filegen API
            getFileTypes: getFileTypes,
            getAccountPortfolios: getAccountPortfolios,
            getSecurities: getSecurities,
            //dashboard service api
            getMessageCount: getMessageCount,
            getExecutionSummary: getExecutionSummary,
            getExecutionParameters: getExecutionParameters,
            getExecutionFileDetails: getExecutionFileDetails,
            getExecutionActivityDetails: getExecutionActivityDetails,
            getDocumentsData: getDocumentsData,
           // getDocumentParameters: getDocumentParameters,
            getDocumentDetails: getDocumentDetails,
            submitRequest: submitRequest,
                getDeliveryTypes: getDeliveryTypes
        };

        return service;
        
        //Mock Submit Request.
        function submitRequest(request){
         
            return $q.when('8f6caf08-7ce5-4e28-abaf-6f834a41b890');
        }
        
        function getDeliveryTypes(request){
         var deliveryType= [
                            {id:"1", name:"Email"}, 
                            {id:"2", name:"FTP"}
                            ]
            return $q.when(deliveryType);
        }

        //get FileTypes
        function getFileTypes() {
            var fileTypes = {
                multiDay: [
                              { name: "JEN_FIPA_VALIDATION", value: "", supportsDateRange: true },
                              { name: "JEN_FIPA_TRANSACTION", value: "", supportsDateRange: true },
                              { name: "JEN_FIPA_DELETION", value: "", supportsDateRange: true },
                              { name: "JEN_FIPA_MKTVAL_CALC", value: "", supportsDateRange: true },
                              { name: "JEN_FIPA_MKTVAL_CALC_ME", value: "", supportsDateRange: true },
                              { name: "JEN_FIPA_MKTVAL_NO_CALC", value: "", supportsDateRange: true },
                              { name: "JEN_FIPA_MKTVAL_NO_CALC_ME", value: "", supportsDateRange: true },
                ],

                singleDay: [                              
                              { name: "JEN_FIPA_VALIDATION", value: "", supportsDateRange: true },
                              { name: "JEN_FIPA_TRANSACTION", value: "", supportsDateRange: true },
                              { name: "JEN_FIPA_DELETION", value: "", supportsDateRange: true },
                              { name: "JEN_FIPA_MKTVAL_CALC", value: "", supportsDateRange: true },
                              { name: "JEN_FIPA_MKTVAL_CALC_ME", value: "", supportsDateRange: true },
                              { name: "JEN_FIPA_MKTVAL_NO_CALC", value: "", supportsDateRange: true },
                              { name: "JEN_FIPA_MKTVAL_NO_CALC_ME", value: "", supportsDateRange: true },
                              { name: "JEN_FIPA_POSITION", value: "", supportsDateRange: false }
                ]
            }

            return $q.when(fileTypes);
        }

        function getAccountPortfolios() {
            var porfolioInfo = [
                { accountCode: "accCode1", accountName: "accName1", portfolioCode: "portfolio1", portfolioName: "portfolioName1", startDate:'06/10/2014', exists:true },
                { accountCode: "accCode2", accountName: "accName2", portfolioCode: "portfolio2", portfolioName: "portfolioName2", startDate: '02/10/2014' ,exists:true},
                { accountCode: "accCode3", accountName: "accName3", portfolioCode: "portfolio3", portfolioName: "portfolioName3", startDate: '04/10/2014' ,exists:true},
                { accountCode: "accCode4", accountName: "accName4", portfolioCode: "portfolio4", portfolioName: "portfolioName4", startDate: '01/10/2014' ,exists:true}

            ];
            return $q.when(porfolioInfo);
        }

        function getSecurities(accountCodeList) {
            var securityInfo = [
                                    { accountCode: "accCode1", securityCode: "secCode1", securityName: "secName1" },
                                    { accountCode: "accCode1", securityCode: "secCode2", securityName: "secName2" },
                                    { accountCode: "accCode1", securityCode: "secCode3", securityName: "secName3" },
                                    { accountCode: "accCode1", securityCode: "secCode4", securityName: "secName4" },
                                    { accountCode: "accCode1", securityCode: "secCode5", securityName: "secName5" },
                                    { accountCode: "accCode2", securityCode: "secCode6", securityName: "secName6" },
                                    { accountCode: "accCode2", securityCode: "secCode7", securityName: "secName7" },
                                    { accountCode: "accCode2", securityCode: "secCode8", securityName: "secName8" },
                                    { accountCode: "accCode2", securityCode: "secCode9", securityName: "secName9" },
                                    { accountCode: "accCode2", securityCode: "secCode10", securityName: "secName10" }

            ]
            return $q.when(securityInfo);
        };

        function getMessageCount() { return $q.when(72); }

        //DashboardSummary Function
        function getExecutionSummary() {
            var executionSummary = [
                { id: '8f6caf08-7ce5-4e28-abaf-6f834a41b890', name: 'Fipa_May192015_1304', status: 'Pending', startDate: '05/19/2015 13:04', endDate: '', requester: 'Lo Wang' },
                { id: '13d91d6c-e026-402b-b922-7a8dc83a92ae', name: 'Fipa_May172015_1404', status: 'Success', startDate: '05/17/2015 14:04', endDate: '05/17/2015 16:05', requester: 'Damian Reeves' },
                { id: '16067d9ca-37c9-4533-9485-23e297721928', name: 'Fipa_May162015_1204', status: 'Pending', startDate: '05/16/2015 12:04', endDate: '05/16/2015 21:05', requester: 'Karen Even' },
                { id: '8c48ce75-df8a-431c-8f78-87591621ac0b', name: 'Fipa_May112015_09:15', status: 'Success', startDate: '05/11/2015 09:15', endDate: '05/12/2015 21:05', requester: 'Karen Even' },
                { id: '5746987a-7c44-44f3-80be-7c64ce45948c', name: 'Fipa_May092015_1104', status: 'Success', startDate: '05/09/2015 11:04', endDate: '05/12/2015 14:10', requester: 'Scott Bornstein ' },
                { id: '12c60a54-1f68-4564-9cde-eaae298c7e19', name: 'Fipa_May122015_1505', status: 'Failed', startDate: '05/12/2015 15:05', endDate: '05/14/2015 21:05', requester: 'Karen Even' },
                { id: '26070037-09ab-4502-a4de-9342528807f4', name: 'Fipa_May082015_1505', status: 'Pending', startDate: '05/08/2015 15:05', endDate: '', requester: 'Karen Even' }
            ];
            return $q.when(executionSummary);
        }

        //Execution parameters Detail for dashboard detail page
        function getExecutionParameters(guid) {
            var executionParameters =
                {
                    id: "8f6caf08-7ce5-4e28-abaf-6f834a41b890",
                    multiDay: {
                        dateFrom: "06/19/2014",
                        dateTo: "05/21/2015",
                        fileTypes: [{ name: "JEN_FIPA_TRANSACTION" },
                                    { name: "JEN_FIPA_MKTVAL_CALC" },
                                    { name: "JEN_FIPA_MKTVAL_NO_CALC" }
                        ]
                    },
                    singleDay: {
                        dateFrom: "06/19/2014",
                        dateTo: "",
                        fileTypes: [
                                    { name: "JEN_FIPA_POSITION" }
                        ]
                    },
                    portfolios: [
                        { code: "1", name: "portfolio_1" },
                        { code: "2", name: "portfolio_2" },
                        { code: "3", name: "portfolio_3" },
                        { code: "4", name: "portfolio_4" }
                    ],
                    excludedSecurities: [
                        { id: "1", name: "xyz" },
                        { id: "2", name: "abc" }
                    ],
                    deliveryType: {
                        email: "false",
                        sftp: "true"
                    }
                }

            return $q.when(executionParameters);
        } //End Execution Parameters

        function getExecutionFileDetails(batchId) {

            var executionFileDetails =
            {
                batchId: "8f6caf08-7ce5-4e28-abaf-6f834a41b890",
                filedetails:
                [
                    {
                        name: "Jen_Fipa_Transaction_8f6caf08-7ce5-4e28-abaf-6f834a41b890",
                        typeName: "Jen_Fipa_Transaction",
                        //Either filegen-completed, filegen-failed, filegen-pending
                        status: "filegen-pending",
                        retryNum: "",
                        startTime: "05/19/2015 13:04",
                        endTime: "",
                        requester: "Lo Wang"
                    },
                    {
                        name: "Jen_Fipa_MktVal_8f6caf08-7ce5-4e28-abaf-6f834a41b890",
                        typeName: "Jen_Fipa_MktVal",
                        //Either Completed, Failed, Pending
                        status: "outbound-pending",
                        retryNum: "",
                        startTime: "05/19/2015 13:04",
                        endTime: "",
                        requester: "Lo Wang"
                    },
                    {
                        name: "Jen_Fipa_Deletion_8f6caf08-7ce5-4e28-abaf-6f834a41b890",
                        typeName: "Jen_Fipa_Deletion",
                        //Either Completed, Failed, Pending
                        status: "outbound-pending",
                        retryNum: "",
                        startTime: "05/19/2015 13:04",
                        endTime: "",
                        requester: "Lo Wang"
                    },
                    {
                        name: "Jen_Fipa_Validation_8f6caf08-7ce5-4e28-abaf-6f834a41b890",
                        typeName: "Jen_Fipa_Validation",
                        //Either Completed, Failed, Pending
                        status: "outbound-pending",
                        retryNum: "",
                        startTime: "05/19/2015 13:04",
                        endTime: "",
                        requester: "Lo Wang"
                    }
                ]


            }
            return $q.when(executionFileDetails);
        }// End Excecution Files

        function getExecutionActivityDetails(fileId) {

            var executionActivityDetails =
            {
                activityDetails:
                [
                    {
                        activityId: "1",
                        description: "Generate",
                        //Either filegen-completed, filegen-failed, filegen-pending
                        status: "pending",
                        startTime: "05/19/2015 13:04",
                        endTime: "",
                        requester: "Lo Wang"
                    },
                    {
                        activityId: "2",
                        description: "outbound",
                        //Either Completed, Failed, Pending
                        status: "pending",
                        retryNum: "",
                        startTime: "05/19/2015 13:04",
                        endTime: "",
                        requester: "Lo Wang"
                    },
                    {
                        activityId: "3",
                        description: "inbound",
                        //Either Completed, Failed, Pending
                        status: "pending",
                        retryNum: "",
                        startTime: "05/20/2015 13:04",
                        endTime: "",
                        requester: "Lo Wang"
                    },
                    {
                        activityId: "4",
                        description: "inbound",
                        //Either Completed, Failed, Pending
                        status: "success",
                        retryNum: "",
                        startTime: "05/20/2015 15:06",
                        endTime: "",
                        requester: "Lo Wang"
                    },
                ]
            }

            return $q.when(executionActivityDetails);
        } //End Execution Activity


        //Documents Activity & Details
        function getDocumentsData() {
            var documentsData = [
                { id: '8f6caf08-7ce5-4e28-abaf-6f834a41b890', name: 'Fipa_inbound.xls', docversion: '1.0', dateCreated: '05/19/2015 13:04', dateModified: '06/18/2015 14:02', owner: 'Lo Wang' },
             
            ];
            return $q.when(documentsData);
        }

        function getDocumentDetails(batchId) {

            var documentDetail =
            {
                Id: "8f6caf08-7ce5-4e28-abaf-6f834a41b890",
                name: "Jen_Fipa_Transaction_8f6caf08-7ce5-4e28-abaf-6f834a41b890",
                docversion: '1.0',
                dateCreated: '05/19/2015 13:04', 
                dateModified: '06/18/2015 14:02',
                owner: 'Lo Wang'
            }


            
            return $q.when(documentDetail);
        }

    }
})();