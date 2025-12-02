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

    $scope.logout = function () {
        currentUser.clearUser();
    };

    // Watch for cart changes
    $scope.$watch(
        () => currentUser.state.cart.total,
        () => {
            $scope.data.cart = currentUser.state.cart;
        }
    );

    // watch login state
    $scope.$watch(
        () => currentUser.state.user,
        () => {
            $scope.data.user = currentUser.state.user;
        }
    );
});