(function(angular) {
    'use strict';
    var app = angular.module('countries', ["ngRoute"]);

    app.config(['$compileProvider', '$routeProvider', function($compileProvider, $routeProvider) {
        //   $compileProvider.debugInfoEnabled(false);
        $compileProvider.commentDirectivesEnabled(false);
        $compileProvider.cssClassDirectivesEnabled(false);
        $routeProvider
            .when("/", {
                templateUrl: "main.html"
            })
            .when("/countries", {
                templateUrl: "countries.html",
                controller: "CountriesController"
            })
            .when("/regions", {
                templateUrl: "regions.html",
                // controller: "RegionsController"
            })
            .when("/regions/:regionName", {
                templateUrl: "region.html",
                // controller: "RegionController"
            })
            .when("/pivot", {
                templateUrl: "pivot.html",
                controller: "PivotController"
            })
            .otherwise("/countries", {
                template: "<h1>404 Page Not Found</h1>"
            });
    }]);

    app.run(['getter', function(getter) {
        getter.load().then(function(data) {
            console.log('run load then', data);
        });
    }]);

    app.factory('getter', ['$http', function($http) {
        var URL = 'https://restcountries.eu/rest/v2/all';
        var countries = [];
        var regions = {};

        var load = function() {
            return $http.get(URL).then(function(response) {
                console.log('loadcountries', response);
                angular.forEach(response.data, function(country) {
                    countries.push(country);
                    regions[country.region] = country.region;
                });
                console.log('regions', regions);
                return response.data;
            });
        }

        return {
            load: load,
            regions: regions,
            countries: countries,
        }
    }]);


    app.controller('CountriesController', ['$scope', 'getter', function($scope, getter) {
        $scope.countries = getter.countries;
        $scope.regions = getter.regions;
    }]);

    app.controller('RegionsController', ['$scope', 'getter', function($scope, getter) {
        $scope.regions = getter.regions;
    }]);

    app.controller('RegionController', ['$scope', 'getter', function($scope, getter) {
        // $scope.regions = getter.regions.slice(0, 10);
    }]);

    app.controller('PivotController', function() {
    });


    app.directive('countries1', function() {
        return {
            restrict: 'E',
            templateUrl: 'views/countries.html'
        };
    });

    app.component('regions', {
        scope: '=',
        templateUrl: 'regions.template.html',
        // controller: 'RegionsController'
    });

    app.component('countries', {
        scope: true,
        templateUrl: 'countries.template.html',
        // controller: 'CountriesController',
    });


})(window.angular);
