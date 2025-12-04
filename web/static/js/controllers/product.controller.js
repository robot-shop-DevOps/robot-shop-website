'use strict';

angular.module('robotshop').controller('productform', function(
    $scope, $http, $routeParams, $timeout, currentUser
) {

    $scope.data = {
        message: '',
        product: {},
        rating: { avg_rating: 0 },
        quantity: 1,
        username: currentUser.state.username,
        loggedIn: currentUser.isLoggedIn()
    };

    /* -----------------------------------
       Watch login state
    ----------------------------------- */
    $scope.$watch(
        () => currentUser.state.username,
        (newVal) => {
            $scope.data.username = newVal;
            $scope.data.loggedIn = currentUser.isLoggedIn();
        }
    );

    /* -----------------------------------
       Add to Cart (JWT-protected)
    ----------------------------------- */
    $scope.addToCart = function() {

        if (!currentUser.isLoggedIn()) {
            $scope.data.message = "You must log in first.";
            $timeout(clearMessage, 3000);
            return;
        }

        const username = currentUser.state.username;

        const url =
            '/api/cart/add/' +
            encodeURIComponent(username) + '/' +
            encodeURIComponent($scope.data.product.sku) + '/' +
            $scope.data.quantity;

        $http.get(url, {
            headers: currentUser.getAuthHeader()
        })
        .then(res => {
            currentUser.state.cart = res.data;
            $scope.data.message = 'Added to cart';
            $timeout(clearMessage, 3000);
        })
        .catch(e => {
            $scope.data.message = 'ERROR adding to cart';
            $timeout(clearMessage, 3000);
        });
    };

    /* -----------------------------------
       Rate Product (public)
    ----------------------------------- */
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

    /* -----------------------------------
       Load product data
    ----------------------------------- */
    function loadProduct(sku) {
        $http.get('/api/catalogue/product/' + sku)
            .then(res => { $scope.data.product = res.data; })
            .catch(e => console.log('ERROR', e));
    }

    /* -----------------------------------
       Load rating
    ----------------------------------- */
    function loadRating(sku) {
        $http.get('/api/ratings/api/fetch/' + sku)
            .then(res => { $scope.data.rating = res.data; })
            .catch(e => console.log('ERROR', e));
    }

    function clearMessage() {
        $scope.data.message = '';
    }

    /* -----------------------------------
       INIT
    ----------------------------------- */
    loadProduct($routeParams.sku);
    loadRating($routeParams.sku);
});