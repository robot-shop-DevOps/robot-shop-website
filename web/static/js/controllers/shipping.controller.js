/* global autoComplete */

'use strict';

angular.module('robotshop').controller('shipform', function($scope, $http, $location, currentUser) {

    // User must be logged in
    if (!currentUser.isLoggedIn()) {
        $location.url('/login');
        return;
    }

    $scope.data = {
        countries: [],
        selectedCountry: '',
        selectedLocation: '',
        disableCity: true,
        disableCalc: true,
        shipping: ''
    };

    let autoLocation;
    let locUuid;  // shipping location UUID (not user id!)

    /* -----------------------------------
       Calculate Shipping
    ----------------------------------- */
    $scope.calcShipping = function() {

        $http.get('/api/shipping/calc/' + locUuid, {
            headers: currentUser.getAuthHeader()
        })
        .then(res => {
            $scope.data.shipping = res.data;
            $scope.data.shipping.location =
                $scope.data.selectedCountry.name + ' ' + autoLocation;
        })
        .catch(e => console.log('ERROR', e));
    };

    /* -----------------------------------
       Confirm Shipping
    ----------------------------------- */
    $scope.confirmShipping = function() {

        const username = currentUser.state.username;

        $http.post('/api/shipping/confirm/' + encodeURIComponent(username),
            $scope.data.shipping,
            { headers: currentUser.getAuthHeader() }
        )
        .then(res => {
            currentUser.state.cart = res.data;
            $location.url('/payment');
        })
        .catch(e => console.log('ERROR', e));
    };

    /* -----------------------------------
       Country Change Reset
    ----------------------------------- */
    $scope.countryChanged = function() {
        if ($scope.data.selectedCountry)
            $scope.data.disableCity = false;

        $scope.data.selectedLocation = '';
        $scope.data.disableCalc = true;
        $scope.data.shipping = '';
    };

    /* -----------------------------------
       Load Country Codes
    ----------------------------------- */
    function loadCodes() {
        $http.get('/api/shipping/codes', {
            headers: currentUser.getAuthHeader()
        })
        .then(res => { 
            $scope.data.countries = res.data; 
        })
        .catch(e => console.log('ERROR', e));
    }

    /* -----------------------------------
       Auto-Complete for City Search
    ----------------------------------- */
    function buildauto() {
        autoLocation = new autoComplete({
            selector: 'input[id=location]',
            source: (term, suggest) => {
                $scope.data.disableCalc = true;

                $http.get('/api/shipping/match/' +
                    $scope.data.selectedCountry.code + '/' + term,
                    { headers: currentUser.getAuthHeader() }
                )
                .then(res => suggest(res.data))
                .catch(e => console.log('ERROR', e));
            },
            renderItem: (item) => {
                return (
                    '<div class="autocomplete-suggestion" ' +
                    'loc-uuid="' + item.uuid + '" ' +
                    'data-val="' + item.name + '">' +
                    item.name +
                    '</div>'
                );
            },
            onSelect: (e, term, item) => {
                locUuid = item.getAttribute('loc-uuid');
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