(function(angular) {
    'use strict';
    var myApp = angular.module('countries', []);

    myApp.factory('getter', ['$http', function($http) {
        var URL = 'https://restcountries.eu/rest/v2/all';
        var countries;

        var load = function() {
            return $http.get(URL).then(function(response) {
                console.log('loadcountries', response);
                return response.data;
            });
        }

        return {
            load: load
        }
    }]);


    myApp.controller('CountryController', ['$scope', 'getter', function($scope, rest) {
        $scope.countries = [];
        rest.load().then(function(data) {
            console.log('load then', data);
            $scope.countries = data;
        });
        console.log('this.countries', $scope.countries, this);
    }]);

})(window.angular);
