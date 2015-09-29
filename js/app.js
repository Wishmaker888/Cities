'use strict';

(function() {

	var app = angular.module('citiesApp', ['ui.bootstrap', 'CityModule']);

	app.controller('CitiesController', ['$scope', '$http', 'CloudService',
		function($scope, $http, CloudService){
			$scope.message = {
				show: false,
				result: ''
			};

			// Used for a typeahead within input in index.html
			$scope.citiesArray = [];

			$http.get('/angular-tweet/js/cities.json')
				.then( function(response) {
					$scope.citiesArray = response.data.citiesJson;

				}, function(response) {
					console.log('Error', response);
				}
			);

			// Will be stored into cloud
			$scope.cities = [];

			$scope.onSelect = function ($item) {
				$scope.$item = $item;
				$scope.cities.push($scope.$item);
			};

			// Getting cities from local storage (get from App42 by ID) if we have keep
			// it earlier.
			if (typeof(Storage) !== "undefined" && localStorage.getItem('storageObjId')) {

				// Calling service with a callbacks
				CloudService.getData(localStorage.getItem('storageObjId'), function(servCities) {
					$scope.$apply(function() {
						$scope.cities = servCities;
					});

				}, function (responseObj) {
					showResult(responseObj);
				});
			}

			// Function for calling service to save all choosed cities in App42
			$scope.saveInCloud = function() {
				var cities = $scope.cities;

				CloudService.saveData(cities, showResult, showResult);
			};

			var showResult = function (responseObj) {
				$scope.$apply(function() {
					$scope.message.show = true;
					$scope.message.result = responseObj.message;
				})
			};
		}
	]);
})();
