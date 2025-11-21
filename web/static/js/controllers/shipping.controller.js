'use strict';

angular.module('robotshop').controller('shipform', function($scope, $http, $location, currentUser) {
    $scope.data = {
        countries: [],
        selectedCountry: '',
        selectedLocation: '',
        disableCity: true,
        disableCalc: true,
        shipping: ''
    };

    var autoLocation;
    var uuid;

    $scope.calcShipping = function() {
        $http.get('/api/shipping/calc/' + uuid)
            .then(res => {
                $scope.data.shipping = res.data;
                $scope.data.shipping.location = $scope.data.selectedCountry.name + ' ' + autoLocation;
            })
            .catch(e => console.log('ERROR', e));
    };

    $scope.confirmShipping = function() {
        $http.post('/api/shipping/confirm/' + currentUser.uniqueid, $scope.data.shipping)
            .then(res => {
                currentUser.cart = res.data;
                $location.url('/payment');
            })
            .catch(e => console.log('ERROR', e));
    };

    $scope.countryChanged = function() {
        if ($scope.data.selectedCountry) $scope.data.disableCity = false;
        $scope.data.selectedLocation = '';
        $scope.data.disableCalc = true;
        $scope.data.shipping = '';
    };

    function loadCodes() {
        $http.get('/api/shipping/codes')
            .then(res => { $scope.data.countries = res.data; })
            .catch(e => console.log('ERROR', e));
    }

    function buildauto() {
        autoLocation = new autoComplete({
            selector: 'input[id=location]',
            source: (term, suggest) => {
                $scope.data.disableCalc = true;
                $http.get('/api/shipping/match/' + $scope.data.selectedCountry.code + '/' + term)
                    .then(res => suggest(res.data))
                    .catch(e => console.log('ERROR', e));
            },
            renderItem: (item, search) => {
                return '<div class="autocomplete-suggestion" loc-uuid="' + item.uuid + '" data-val="' + item.name + '">' + item.name + '</div>';
            },
            onSelect: (e, term, item) => {
                uuid = item.getAttribute('loc-uuid');
                autoLocation = item.getAttribute('data-val');
                $scope.data.disableCalc = false;
                $scope.data.shipping = '';
                $scope.$apply();
            }
        });
    }

    loadCodes();
    buildauto();
});