'use strict';

(function() {
	var CityModule = angular.module('CityModule', []);

	/* Initialize with App42 */
	App42.initialize("cae533dbaead73966fb26af4cca2d745343835c12e1246f57931af1b6ddd37cb",
		"274a095171ed0903486c9f0cc8205081ed93df0873010ff9b9817e619f37c05a");
	var dbName = 'dbCities';
	var colName = 'colCities';

	CityModule.service('CloudService', function(){

		var objectId = null;
		var responseObj = {};
		var storageService = new App42Storage();

		// We need a calback here because this App42 does not return any values,
		// only find
		this.getData = function(objectId, successCallback, errorCallback) {
			if (objectId !== null) {

				showPreloader();

				storageService.findDocumentById(dbName, colName, objectId,{

					success: function(object) {
						var storageObj = JSON.parse(object);
						var response = storageObj.app42.response.storage;
						var servCities = response.jsonDoc.data;

						successCallback(servCities);

						hidePreloader();
					},
					error: function(error) {
						hidePreloader();

						var errorObj = JSON.parse(error);
						var message = errorObj.app42Fault.details;

						responseObj.message = message;

						errorCallback(responseObj);
					}
				});
			} else {
				alert('Something went wrong..');
			}
		};

		this.saveData = function(cities, successCallback, errorCallback) {
			if (cities.length != 0) {
				showPreloader();

				var json = JSON.stringify({'data': cities});

				if (localStorage.getItem('storageObjId') ) {
					var objId = localStorage.getItem('storageObjId');

					this.updateData(objId, json, successCallback);

					hidePreloader();

				} else {
					storageService.insertJSONDocument(dbName, colName, json, {
						success: function(object){
							var storageObj = JSON.parse(object);
							var response = storageObj.app42.response.storage;
							objectId = response.jsonDoc._id.$oid;

							console.log("dbName is " + response.dbName);
							console.log("objectId is " + objectId);

							responseObj.message = 'All cities have been saved successfully.';
							successCallback(responseObj);

							// Save objectId and cities array into the local storage
							if(typeof(Storage) !== "undefined") {
								localStorage.setItem('storageObjId', objectId);
							} else {
								alert('Sorry! No Web Storage support..');
							}

							hidePreloader();
						},
						error: function(error) {
							hidePreloader();

							var errorObj = JSON.parse(error);
							var message = errorObj.app42Fault.details;

							responseObj.message = message;
							errorCallback(responseObj);
						}
					});
				}
			} else {
				alert('Choose some cities first!');
			}

		};

		this.updateData = function(objId, newJson, successCallback) {
			storageService.updateDocumentByDocId(dbName, colName, objId, newJson, {

				success:function(object){
					responseObj.message = 'All cities have been updated successfully.';
					successCallback(responseObj);
				},
				error:function(error){
					console.log(error);
				}
			})
		}
	});

	function showPreloader() {
		document.getElementById('preloader' ).style.display = 'block';
	}

	function hidePreloader() {
		document.getElementById('preloader' ).style.display = 'none';
	}
})();