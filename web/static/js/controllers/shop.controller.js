'use strict';

angular.module('robotshop').controller('shopform', function($scope, $http, $location, currentUser) {

    $scope.data = {
        categories: [],
        products: {},
        searchText: '',
        featured: []
    };

    /* -----------------------------------
       Load Categories
    ----------------------------------- */
    function loadCategories() {
        $http.get('/api/catalogue/categories')
            .then(res => {
                $scope.data.categories = res.data;
            })
            .catch(err => console.error('Error loading categories:', err));
    }

    /* -----------------------------------
       Load Featured Products
    ----------------------------------- */
    function loadFeatured() {
        $http.get('/api/catalogue/products')
            .then(res => {
                $scope.data.featured = res.data.slice(0, 6);
            })
            .catch(err => console.error('Error loading featured products:', err));
    }

    /* -----------------------------------
       Product Expand/Collapse
    ----------------------------------- */
    $scope.getProducts = function(category) {
        if ($scope.data.products[category]) {
            $scope.data.products[category] = null;
        } else {
            $http.get('/api/catalogue/products/' + category)
                .then(res => {
                    $scope.data.products[category] = res.data;
                })
                .catch(err => console.error('Error loading category products:', err));
        }
    };

    /* -----------------------------------
       Search Bar
    ----------------------------------- */
    $scope.search = function() {
        if ($scope.data.searchText.trim()) {
            $location.url('/search/' + $scope.data.searchText.trim());
            $scope.data.searchText = '';
        }
    };

    $scope.startShopping = function () {
        $location.url('/search');
    };

    /* -----------------------------------
       INIT
    ----------------------------------- */
    loadCategories();
    loadFeatured();

    /* -----------------------------------
       Watch for User Login Changes
       (optional UI updates)
    ----------------------------------- */
    $scope.$watch(
        () => currentUser.isLoggedIn(),
        (loggedIn) => {
            $scope.loggedIn = loggedIn;
        }
    );

});