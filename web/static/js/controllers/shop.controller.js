'use strict';

angular.module('robotshop').controller('shopform', function($scope, $http, $location, currentUser) {

    $scope.data = {
        uniqueid: '',
        categories: [],
        products: {},
        searchText: '',
        cart: { total: 0 },
        featured: []  // NEW: For modern homepage
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
       Load Featured Products (NEW)
    ----------------------------------- */
    function loadFeatured() {
        $http.get('/api/catalogue/products')
            .then(res => {
                // Show first 6 items as featured products
                $scope.data.featured = res.data.slice(0, 6);
            })
            .catch(err => console.error('Error loading featured products:', err));
    }

    /* -----------------------------------
       Get Unique ID
    ----------------------------------- */
    function fetchUniqueId() {
        return $http.get('/api/user/uniqueid')
            .then(res => res.data.uuid)
            .catch(err => {
                console.error('Error fetching uuid:', err);
                throw err;
            });
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

    /* -----------------------------------
       INIT: Load Categories, Featured, UUID
    ----------------------------------- */
    loadCategories();
    loadFeatured();   // NEW

    if (!currentUser.uniqueid) {
        fetchUniqueId().then(id => {
            $scope.data.uniqueid = id;
            currentUser.uniqueid = id;
        });
    } else {
        $scope.data.uniqueid = currentUser.uniqueid;
    }

    /* -----------------------------------
       Watch for Login/User Change
    ----------------------------------- */
    $scope.$watch(
        () => currentUser.uniqueid,
        (newVal, oldVal) => {
            if (newVal !== oldVal) {
                $scope.data.uniqueid = newVal;
            }
        }
    );

    /* -----------------------------------
       Watch for Cart Changes
    ----------------------------------- */
    $scope.$watch(
        () => currentUser.cart.total,
        () => {
            $scope.data.cart = currentUser.cart;
        }
    );
});