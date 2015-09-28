'use strict';

(function() {

	var app = angular.module('citiesApp', ['ui.bootstrap', 'CityModule']);

	app.controller('CitiesController', ['$scope', 'CloudService',
		function($scope, CloudService){
			$scope.message = {
				show: false,
				result: ''
			};

			$scope.citiesArray = ['Kiev', 'Zaporizhzhya', 'Donetsk', 'Nikopol',
			'Lviv', 'Chernigov', 'Zelenodolsk', 'Dniepropetrovsk', 'Lugansk',
			'Yalta', 'New York', 'Boston', 'San Francisco', 'Moscow', 'Rio'];

			$scope.cities = [];

			$scope.onSelect = function ($item) {
				$scope.$item = $item;
				$scope.cities.push($scope.$item);
			};

			// Getting cities from local storage (get from App42 by ID) if we have keep
			// them earlier.
			if (typeof(Storage) !== "undefined" && localStorage.getItem('storageObjId')) {

				// Calling service with a callbacks
				CloudService.getData(localStorage.getItem('storageObjId'), function(servCities) {
					$scope.$apply(function() {
						$scope.cities = servCities;
					});

				}, function (responseObj) {
					$scope.$apply(function() {
						$scope.message.show = true;
						$scope.message.result = responseObj.message;
					})
				});
			}

			// Function for calling service to save all choosed cities in App42
			$scope.saveInCloud = function() {
				CloudService.saveData($scope.cities, function(responseObj) {
					$scope.$apply(function() {
						$scope.message.show = true;
						$scope.message.result = responseObj.message;
					})
				}, function(responseObj) {
					$scope.$apply(function() {
						$scope.message.show = true;
						$scope.message.result = responseObj.message;
					})
				})

			}
		}
	]);
})();
