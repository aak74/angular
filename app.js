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
            // console.log('run load then', data);
        });
    }]);

    app.factory('getter', ['$http', function($http) {
        var countries = [];
        var regions = {};

        var load = function() {
            return $http.get('data/countries.json').then(function(response) {
                // console.log('loadcountries', response);
                angular.forEach(response.data, function(country) {
                    if (!country.area) {
                        country.area = 1;
                    }
                    if (!country.region) {
                        country.region = 'TBD';
                    }
                    country.density = country.population / country.area;
                    country.language = country.languages[0].name;
                    country.flag = 'data/flags/' + country.alpha3Code.toLowerCase() + '.svg';
                    countries.push(country);
                    if (country.region) {
                        regions[country.region] = country.region;
                    }
                });
                // console.log('regions', regions);
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
        $scope.orderBy = 'name';
        // $scope.search = {};

        $scope.$watch(function () {
            // console.log('$scope.$watch', $scope);
            $scope.filteredCountries = $scope.$eval("countries | filter:{region: search}:strict | orderBy: orderBy");
            $scope.total = {
                area: 0,
                population: 0,
            };
            angular.forEach($scope.filteredCountries, function(country, index) {
                country.index = index + 1;
                $scope.total.area += country.area;
                $scope.total.population += country.population;
            });
        });

        $scope.setRegion = function(region) {
            // console.log('$scope.setRegion', $scope, region);
            $scope.search = region;
        }

        $scope.setOrderBy = function(orderBy) {
            // console.log('$scope.setOrderBy', orderBy, $scope);
            $scope.orderBy = ($scope.orderBy == orderBy)
                ? '-' + orderBy
                : orderBy;
        }

    }]);

    app.controller('RegionsController', ['$scope', 'getter', function($scope, getter) {
        $scope.regions = getter.regions;
    }]);

    app.controller('RegionController', ['$scope', 'getter', function($scope, getter) {
        // $scope.regions = getter.regions.slice(0, 10);
    }]);

    app.controller('PivotController', function() {
    });

    app.controller('OrderController', ['$scope', function($scope) {
        $scope.isOrderByEqual = function(orderBy) {
            return orderBy == $scope.orderBy;
        }
    }]);


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

    app.directive('orderBy', function() {
        return {
            restrict: 'EA',
            scope: true,
            transclude: true,
            templateUrl: 'orderBy.template.html',
            link: function(scope, element, attrs) {
                // console.log('link orderBy', scope, element, attrs, ctrl);
                scope.by = attrs.by;
                // scope.orderBy = scope.$parent.orderBy;

            }
        }
    });


})(window.angular);
