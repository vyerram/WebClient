(function () {
	'use strict';

	var serviceId = 'datastore';
	angular
			.module('app')
			.factory('datastore', datastore);

	datastore.$inject = ['$rootScope', '$http', '$data', 'common', 'Hub'];

	function datastore($rootScope, $http, $data, common, Hub) {
		var $q = common.$q;
		var getLogFn = common.logger.getLogFn;
		var log = getLogFn(serviceId);

		$data.Entity.extend('DocumentMetadata', {
			Id: { type: $data.Guid, key: true },
			Name: { type: String, required: true },
			Version: { type: String },
			DateCreated: { type: Date },
			DateModified: { type: Date },
			Owner: { type: String }
		});

		$data.EntityContext.extend('$fipa.FipaDb', {
			Documents: { type: $data.EntitySet, elementType: DocumentMetadata }
		});

		var appDb = new $fipa.FipaDb("FipaDb");		
		appDb.onReady(function () {
			console.log('appDb is Ready');
			$rootScope.$broadcast('datastore_documentsChanged', appDb.Documents);
			console.log('broadcasted data');
		});
		var hub = new Hub('datastore', {
			rootPath: 'http://localhost:9569/signalr',
			listeners: {
				'documentsChanged': function (documents) {
					//Documents.fill(documents);
					//$rootScope.$apply();
					angular.forEach(documents, function (doc) {
						var docEntity = new DocumentMetadata();
						docEntity.Id = doc.Id;
						docEntity.Name = doc.Name;
						docEntity.Owner = doc.Owner;
						docEntity.DateCreated = doc.DateCreated;
						docEntity.DateModified = doc.DateModified;
						docEntity.Version = ""+doc.Version;
						appDb.Documents.add(docEntity);
					});
					appDb.saveChanges().then(function () {
						console.log('changes saved!!!');
						$rootScope.$broadcast('datastore_documentsChanged', appDb.Documents);
					});
				},	
				'documentAdded': function (doc) {
					//Documents.add(doc);
					$rootScope.$broadcast('documentAdded', doc);
				}
			},
			methods: ['clientReady','getDocuments', 'viewActivated'],
			errorHandler: function (error) {
				common.logger.logError(error);
			},
			stateChanged: function (state) {
				switch (state.newState) {
					case $.signalR.connectionState.connecting:
						//your code here
						break;
					case $.signalR.connectionState.connected:
						//your code here
						console.log('The datastore hub is connected.');
						break;
					case $.signalR.connectionState.reconnecting:
						//your code here
						break;
					case $.signalR.connectionState.disconnected:
						//your code here
						break;
				}
			},
			logging: true
		});

		var service = {

			documents: appDb,
			viewActivated: viewActivated,
			getData: getData
		};

		return service;

		function getData() { }		

		function viewActivated(view) {
			hub.viewActivated(view);
		}
	}
})();