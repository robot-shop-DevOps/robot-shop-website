'use strict';

angular.module('robotshop').controller('cartform', function($scope, $http, $location, currentUser) {

    // If user is not logged in → redirect to login
    if (!currentUser.isLoggedIn()) {
        $location.url('/login');
        return;
    }

    $scope.data = {
        cart: { total: 0 },
        username: currentUser.state.username
    };

    /* -----------------------------------
       Go to Shipping
    ----------------------------------- */
    $scope.buy = function() {
        $location.url('/shipping');
    };

    /* -----------------------------------
       Update Item Quantity
    ----------------------------------- */
    $scope.change = function(sku, qty) {

        const url = '/api/cart/update/' 
            + encodeURIComponent($scope.data.username) + '/' 
            + encodeURIComponent(sku) + '/' 
            + qty;

        $http.get(url, {
            headers: currentUser.getAuthHeader()
        })
        .then(res => {
            $scope.data.cart = res.data;
            currentUser.state.cart = res.data;
        })
        .catch(e => console.log('ERROR', e));
    };

    /* -----------------------------------
       Load Cart
    ----------------------------------- */
    function loadCart(username) {

        $http.get('/api/cart/cart/' + encodeURIComponent(username), {
            headers: currentUser.getAuthHeader()
        })
        .then(res => {
            let cart = res.data;

            // Remove "SHIP" item if backend auto adds it
            if (cart.items && cart.items.length > 0 &&
                cart.items[cart.items.length - 1].sku === 'SHIP') {

                $http.get('/api/cart/update/' 
                    + encodeURIComponent(username) + '/SHIP/0', {
                    headers: currentUser.getAuthHeader()
                })
                .then(clean => {
                    currentUser.state.cart = clean.data;
                    $scope.data.cart = clean.data;
                })
                .catch(e => console.log('ERROR', e));

            } else {
                $scope.data.cart = cart;
            }
        })
        .catch(e => console.log('ERROR', e));
    }

    loadCart($scope.data.username);
});