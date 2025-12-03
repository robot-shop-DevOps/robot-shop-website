'use strict';

angular.module('robotshop').controller('productform', function($scope, $http, $routeParams, $timeout, currentUser) {
    $scope.data = {
        message: ' ',
        product: {},
        rating: { avg_rating: 0 },
        quantity: 1
    };

    $scope.addToCart = function() {
        if (!currentUser.isLoggedIn()) {
            $scope.data.message = "You must log in first.";
            $timeout(clearMessage, 3000);
            return;
        }

        var url = '/api/cart/add/' + currentUser.state.uniqueid + '/' + $scope.data.product.sku + '/' + $scope.data.quantity;

        $http.get(url)
            .then(res => {
                currentUser.cart = res.data;
                $scope.data.message = 'Added to cart';
                $timeout(clearMessage, 3000);
            })
            .catch(e => {
                $scope.data.message = 'ERROR ' + e;
                $timeout(clearMessage, 3000);
            });
    };

    $scope.rateProduct = function(score) {
        var url = '/api/ratings/api/rate/' + $scope.data.product.sku + '/' + score;

        $http.put(url)
            .then(() => {
                $scope.data.message = 'Thank you for your feedback';
                $timeout(clearMessage, 3000);
                loadRating($scope.data.product.sku);
            })
            .catch(e => console.log('ERROR', e));
    };

    $scope.glowstan = function(vote, val) {
        var idx = vote;
        while (idx > 0) {
            document.getElementById('vote-' + idx).style.opacity = val;
            idx--;
        }
    };

    function loadProduct(sku) {
        $http.get('/api/catalogue/product/' + sku)
            .then(res => { $scope.data.product = res.data; })
            .catch(e => console.log('ERROR', e));
    }

    function loadRating(sku) {
        $http.get('/api/ratings/api/fetch/' + sku)
            .then(res => { $scope.data.rating = res.data; })
            .catch(e => console.log('ERROR', e));
    }

    function clearMessage() {
        $scope.data.message = ' ';
    }

    loadProduct($routeParams.sku);
    loadRating($routeParams.sku);
});