'use strict';

angular.module('robotshop').controller('cartform', function($scope, $http, $location, currentUser) {
    $scope.data = {
        cart: { total: 0 },
        uniqueid: currentUser.uniqueid
    };

    $scope.buy = function() {
        $location.url('/shipping');
    };

    $scope.change = function(sku, qty) {
        var url = '/api/cart/update/' + $scope.data.uniqueid + '/' + sku + '/' + qty;

        $http.get(url)
            .then(res => {
                $scope.data.cart = res.data;
                currentUser.cart = res.data;
            })
            .catch(e => console.log('ERROR', e));
    };

    function loadCart(id) {
        $http.get('/api/cart/cart/' + id)
            .then(res => {
                var cart = res.data;

                if (cart.items[cart.items.length - 1].sku === 'SHIP') {
                    $http.get('/api/cart/update/' + id + '/SHIP/0')
                        .then(clean => {
                            currentUser.cart = clean.data;
                            $scope.data.cart = clean.data;
                        })
                        .catch(e => console.log('ERROR', e));
                } else {
                    $scope.data.cart = cart;
                }
            })
            .catch(e => console.log('ERROR', e));
    }

    loadCart($scope.data.uniqueid);
});