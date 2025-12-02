'use strict';

angular.module('robotshop').controller('mainController', function($scope, $location, currentUser) {
    
    $scope.data = {
        searchText: '',
        cart: { total: 0 }
    };

    $scope.search = function() {
        if ($scope.data.searchText.trim()) {
            $location.url('/search/' + $scope.data.searchText.trim());
            $scope.data.searchText = '';
        }
    };

    // Watch for cart changes
    $scope.$watch(
        () => currentUser.cart.total,
        () => {
            $scope.data.cart = currentUser.cart;
        }
    );
});