'use strict';

describe('CitiesController', function() {
	beforeEach(module('citiesApp'));

	var $controller;

	beforeEach(inject(function(_$controller_) {
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$controller = _$controller_;
	}));

	describe('$scope.cities and $scope.citiesArray', function () {
		var $scope, controller;

		beforeEach(function() {
			$scope = {};
			controller = $controller('CitiesController', { $scope: $scope } );
		});

		it('should be empty on instantiation', function() {
			expect($scope.cities.length).toBe(0);
			expect($scope.citiesArray.length).toBe(0);
		});

		it('should create an array with selected cities', function() {
			$scope.onSelect('Zp');

			expect($scope.cities).toEqual(['Zp']);
		})
	});


	describe('$http.get', function() {
		it('should set $scope.citiesArray to "city London"', inject(function($controller, $rootScope, $httpBackend) {
			var $scope = $rootScope.$new();

			$httpBackend
				.when('GET', '/angular-tweet/js/cities.json')
				.respond(200, {citiesJson: ['London']});


			var controller = $controller('CitiesController', { $scope: $scope } );
			$httpBackend.flush();

			expect($scope.citiesArray).toEqual(['London']);

		}))
	});




});
